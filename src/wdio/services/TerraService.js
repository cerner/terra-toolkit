import chai from 'chai';
import { exec } from 'child_process';
import retry from 'async/retry';
import http from 'http';
import path from 'path';
import fs from 'fs';

const getSeleniumStatus = (hostname, port, url) => (callback) => {
  http.get({ hostname, port, path: path.join(url || '/wd/hub', 'status') }, (res) => {
    const { statusCode } = res;
    if (statusCode !== 200) {
      callback('Request failed');
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const status = JSON.parse(rawData);
        if (status.value && status.value.ready) {
          callback(null, status);
        } else {
          callback(status);
        }
      } catch (e) {
        callback(`Request failed: ${e.message}`);
      }
    });
  }).on('error', (e) => {
    callback(`Request failed: ${e.message}`);
  });
};

function accessible() {
  // eslint-disable-next-line no-underscore-dangle
  new chai.Assertion(this._obj).to.be.instanceof(Array);
  // eslint-disable-next-line no-underscore-dangle
  const errors = this._obj
    .filter(test => test.result)
    .reduce((all, test) => all.concat(test.result.violations), [])
    .filter(test => test)
    .map(test => `${JSON.stringify(test, null, 4)}`);

  this.assert(errors.length === 0,
    `expected no accessibility violations but got:\n\t${errors[0]}`,
    'expected accessibilty errors but received none');
}

function matchReference() {
  // eslint-disable-next-line no-underscore-dangle
  new chai.Assertion(this._obj).to.be.instanceof(Array);
  // eslint-disable-next-line no-underscore-dangle
  this.assert(this._obj.every(src => src.isExactSameImage),
    'expected screenshots to match reference',
    'expected screenshots to not match reference');
}

const viewport = (...sizes) => {
  const widths = {
    tiny: { width: 470, height: 768 },
    small: { width: 622, height: 768 },
    medium: { width: 838, height: 768 },
    large: { width: 1000, height: 768 },
    huge: { width: 1300, height: 768 },
    enormous: { width: 1500, height: 768 },
  };

  if (sizes.length === 0) {
    return global.viewport('tiny', 'small', 'medium', 'large', 'huge');
  }

  return sizes.map(size => widths[size]);
};


export default class TerraService {
  constructor() {
    this.cidfile = '.docker_selenium_id';
  }

  // eslint-disable-next-line class-methods-use-this, consistent-return
  onPrepare(config) {
    if (!process.env.TRAVIS) {
      exec(`docker run --rm --cidfile ${this.cidfile} -p ${config.port}:4444 selenium/standalone-chrome`);
      return new Promise((resolve, reject) => {
        // Retry for 500 times up to 5 seconds for selenium to start
        retry({ times: 500, interval: 10 }, getSeleniumStatus(config.host, config.port, config.path), (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  before() {
    global.expect = chai.expect;
    global.viewport = viewport;
    chai.Assertion.addMethod('accessible', accessible);
    chai.Assertion.addMethod('matchReference', matchReference);
  }

  // eslint-disable-next-line class-methods-use-this
  onComplete() {
    if (!process.env.TRAVIS) {
      const containerId = fs.readFileSync(this.cidfile, 'utf8');
      exec(`docker stop ${containerId} standalone-chrome && docker`);
      fs.unlinkSync(this.cidfile);
    }
  }
}
