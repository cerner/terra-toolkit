import BaseStrategy from './BaseStrategy';

export default class FullpageScreenshotStrategy extends BaseStrategy {
  // eslint-disable-next-line class-methods-use-this
  hasNextHorizontalScrollPosition() {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  hasNextVerticalScrollPosition() {
    return false;
  }

  getScrollPosition() {
    return {
      x: this.area.startX,
      y: this.area.startY,
      indexX: this.index.x,
      indexY: this.index.y,
    };
  }

  getCropDimensions() {
    const {
      startX, startY, endX, endY,
    } = this.area;

    const width = endX - startX;
    const height = endY - startY;

    return this.createCropDimensions(width, height, 0, 0, true, 0);
  }
}
