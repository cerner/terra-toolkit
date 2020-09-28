/* eslint-disable class-methods-use-this, no-unused-vars */
import fs from 'fs-extra';
import path from 'path';
import logger from '@wdio/logger';

const log = logger('wdio-visual-regression-service:BaseCompare');
const runtimeConfigPath = __dirname;

export default class BaseCompare {
  constructor() {
    this.configs = new Map();
  }

  /**
   * Gets executed once before all workers get launched.
   */
  async onPrepare() {
    return Promise.resolve();
  }

  /**
   * Gets executed before the tests starts.
   */
  async before(context) {
    return Promise.resolve();
  }

  /**
   * Gets executed immediately before the screenshot is taken.
   */
  async beforeScreenshot(context) {
    return Promise.resolve();
  }

  /**
   * Gets executed after the screenshot is taken.
   */
  async afterScreenshot(context, base64Screenshot) {
    return Promise.resolve();
  }

  /**
   * You can do here your image comparison magic.
   */
  async processScreenshot(context, base64Screenshot) {
    return Promise.resolve();
  }

  createResultReport(misMatchPercentage, isWithinMisMatchTolerance, isSameDimensions) {
    return {
      misMatchPercentage,
      isWithinMisMatchTolerance,
      isSameDimensions,
      isExactSameImage: misMatchPercentage === 0,
    };
  }
}
