import CropDimension from '../CropDimension';

export default class BaseStrategy {
  constructor(screenDimensions) {
    this.screenDimensions = screenDimensions;

    this.index = {
      x: 0,
      y: 0,
    };

    this.setScrollArea(0, 0, this.screenDimensions.getDocumentWidth(), this.screenDimensions.getDocumentHeight());
  }

  setScrollArea(startX, startY, endX, endY) {
    // TODO: bug https://github.com/zinserjan/wdio-screenshot/issues/87
    // const documentWidth = this.screenDimensions.getDocumentWidth();
    // const documentHeight = this.screenDimensions.getDocumentHeight();

    // if (startX >= documentWidth) {
    //   throw new Error('startX is out of range');
    // } else if (startY >= documentHeight) {
    //   throw new Error('startY is out of range');
    // } else if (endX > documentWidth) {
    //   throw new Error('endX is out of range');
    // } else if (endY > documentHeight) {
    //   throw new Error('endY is out of range');
    // }

    this.area = {
      startX,
      startY,
      endX,
      endY,
    };
  }

  moveToNextScrollPosition() {
    if (this.hasNextHorizontalScrollPosition()) {
      this.index.x += 1;
    } else if (this.hasNextVerticalScrollPosition()) {
      this.index.x = 0;
      this.index.y += 1;
    }
  }

  hasNextScrollPosition() {
    return this.hasNextHorizontalScrollPosition() || this.hasNextVerticalScrollPosition();
  }

  // eslint-disable-next-line class-methods-use-this
  hasNextHorizontalScrollPosition() {
    throw new Error('not implemented, override it');
  }

  // eslint-disable-next-line class-methods-use-this
  hasNextVerticalScrollPosition() {
    throw new Error('not implemented, override it');
  }

  // eslint-disable-next-line class-methods-use-this
  getScrollPosition() {
    throw new Error('not implemented, override it');
  }

  // eslint-disable-next-line class-methods-use-this
  getCropDimensions() {
    throw new Error('not implemented, override it');
  }

  createCropDimensions(width, height, x, y, top, rotation) {
    const adjustedWidth = this.screenDimensions.applyScaleFactor(width);
    const adjustedHeight = this.screenDimensions.applyScaleFactor(height);
    return new CropDimension(adjustedWidth, adjustedHeight, x, y, top, rotation);
  }
}
