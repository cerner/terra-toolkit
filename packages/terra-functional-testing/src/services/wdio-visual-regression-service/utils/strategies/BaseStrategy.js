const CropDimension = require('../CropDimension');

class BaseStrategy {
  constructor(screenDimensions) {
    this.screenDimensions = screenDimensions;

    this.index = {
      x: 0,
      y: 0,
    };

    this.setScrollArea(0, 0, this.screenDimensions.getDocumentWidth(), this.screenDimensions.getDocumentHeight());
  }

  setScrollArea(startX, startY, endX, endY) {
    const documentWidth = this.screenDimensions.getDocumentWidth();
    const documentHeight = this.screenDimensions.getDocumentHeight();

    // Capture what is visible if the element is rendered partially off the screen.
    // Capture the entire viewable screen dimension if it is rendered completely off the screen.
    const adjustedStartX = startX > documentWidth || startX < 0 ? 0 : startX;
    const adjustedStartY = startY > documentHeight || startY < 0 ? 0 : startY;
    const adjustedEndX = endX > documentWidth || endX < 0 ? documentWidth : endX;
    const adjustedEndY = endY > documentHeight || endY < 0 ? documentHeight : endY;

    this.area = {
      startX: adjustedStartX,
      startY: adjustedStartY,
      endX: adjustedEndX,
      endY: adjustedEndY,
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

module.exports = BaseStrategy;
