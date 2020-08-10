import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import SpectreClient from 'nodeclient-spectre';
import logger from '@wdio/logger';

import BaseCompare from './BaseCompare';

const runtimeConfigName = 'spectre-run';
const log = logger('wdio-terra-visual-regression-service:Spectre');

export default class Spectre extends BaseCompare {
  constructor(options = {}) {
    super();
    this.fuzzLevel = _.get(options, 'fuzzLevel', 30);
    this.spectreURL = options.url;
    this.project = options.project;
    this.suite = options.suite;
    this.test = options.test;
    this.browser = options.browser;
    this.size = options.size;
    this.spectreClient = new SpectreClient(this.spectreURL);
  }

  async onPrepare() {
    const creationOptions = `Api-Url: ${this.spectreURL}, Project: ${this.project}, Suite: ${this.suite}`;
    log.info(`${creationOptions} - Creating testrun`);
    const result = await this.spectreClient.createTestrun(this.project, this.suite);
    log.info(`${creationOptions} - Testrun created - Run-Id: #${result.id}`);

    const testRunUrl = `${this.spectreURL}${result.url}`;
    log.info(testRunUrl);
    fs.writeFileSync(path.resolve('./.spectre_test_run_url.json'), testRunUrl);
    this.saveRuntimeConfig(runtimeConfigName, result);
  }

  async processScreenshot(context, base64Screenshot) {
    const runDetails = await this.getRuntimeConfig(runtimeConfigName);
    const testrunID = runDetails.id;
    const test = await this.test(context);
    const browser = await this.browser(context);
    const size = await this.size(context);
    const fuzzLevel = `${_.get(context, 'options.fuzzLevel', this.fuzzLevel)}%`;
    const url = _.get(context, 'meta.url', undefined);

    const uploadName = `Run-Id: #${testrunID}, Test: ${test}, Url: ${url}, Browser: ${browser}, Size: ${size}, Fuzz-Level: ${fuzzLevel}`;
    log.info(`${uploadName} - Starting upload`);

    const result = await this.spectreClient.submitScreenshot(
      test,
      browser,
      size,
      base64Screenshot,
      testrunID,
      '',
      url,
      fuzzLevel,
    );
    log.info(`${uploadName} - Upload successful`);

    if (result.pass) {
      log.info(`${uploadName} - Image is within tolerance or the same`);
      return this.createResultReport(result.diff, result.pass, true);
    } else { // eslint-disable-line no-else-return
      log.info(`${uploadName} - Image is different! ${result.diff}%`);
      return this.createResultReport(result.diff, result.pass, true);
    }
  }

  async onComplete() {
    await this.cleanUpRuntimeConfigs();
  }
}
