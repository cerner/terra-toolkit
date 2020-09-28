/* eslint-disable class-methods-use-this, no-unused-vars */
import fs from 'fs-extra';
import path from 'path';
import logger from '@wdio/logger';

const log = logger('wdio-visual-regression-service:BaseCompare');
const runtimeConfigPath = __dirname;

export default class BaseCompare {
  constructor() {}

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
