const fs = require('fs-extra');
const path = require('path');
const stripAnsi = require('strip-ansi');
const SpecReporter = require('@wdio/spec-reporter').default;
const endOfLine = require('os').EOL;
const { Logger } = require('@cerner/terra-cli');

const LOG_CONTEXT = '[Terra-Toolkit:fileOutput-reporter]';

class FileOutputReporter extends SpecReporter {
  constructor() {
    super();
    this.runners = [];
    this.resultJsonObject = {
      startDate: '',
      type: 'wdio',
      locale: '',
      formFactor: '',
      theme: '',
      output: {},
      endDate: '',
    };
    this.fileName = '';
    this.moduleName = process.cwd().split(path.sep).pop();

    this.setResultsDir = this.setResultsDir.bind(this);
    this.hasResultsDir = this.hasResultsDir.bind(this);
    this.setTestModule = this.setTestModule.bind(this);
    this.printReport = this.printReport.bind(this);
    this.getMessage = this.getMessage.bind(this);

    this.setResultsDir();
    this.hasResultsDir();
  }

  /**
   * Sets results directory for the test run. Uses the wdio reporterOptions.outputDir if set, otherwise
   * it outputs to tests?/wdio/reports.
   * @return null;
   */
  setResultsDir() {
    const { reporterOptions } = this.options;
    if (reporterOptions && reporterOptions.outputDir) {
      this.resultsDir = reporterOptions.outputDir;
    } else {
      let testDir = 'tests';
      if (fs.existsSync(path.join(process.cwd(), 'test'))) {
        testDir = 'test';
      }
      this.resultsDir = path.join(process.cwd(), testDir, 'wdio', 'reports');
    }
  }

  /**
   * Check and create reports dir if doesn't exist
   * @return null
   */
  hasResultsDir() {
    if (!fs.existsSync(this.resultsDir)) {
      fs.mkdirSync(this.resultsDir, { recursive: true }, (err) => {
        if (err) {
          Logger.error(err.message, { context: LOG_CONTEXT });
        }
      });
    }
  }

  /**
   * Formatting the filename based on locale, theme, and formFactor
   * @return null
   */
  fileNameCheck({ formFactor, locale, theme }, browserName, cid) {
    const fileNameConf = ['fileOutput'];
    if (locale) {
      fileNameConf.push(locale);
      this.resultJsonObject.locale = locale;
    }

    if (theme) {
      fileNameConf.push(theme);
      this.resultJsonObject.theme = theme;
    }

    if (formFactor) {
      fileNameConf.push(formFactor);
      this.resultJsonObject.formFactor = formFactor;
    }

    if (browserName) {
      fileNameConf.push(browserName);
    }

    if (cid) {
      fileNameConf.push(cid);
    }

    this.fileName = fileNameConf.join('-');
  }

  /**
   * Set the package name to moduleName property if specsValue contains /package string
   * @param {string} specsValue - File path of current spec file from runners
   * @return null
   */
  setTestModule(specsValue) {
    const index = specsValue.lastIndexOf(`packages${path.sep}`);
    if (index > -1) {
      const testFilePath = specsValue.substring(index).split(path.sep);
      const moduleName = testFilePath && testFilePath[1]
        ? testFilePath[1]
        : process.cwd().split(path.sep).pop();
      if (moduleName && moduleName !== this.moduleName) {
        this.moduleName = moduleName;
      }
    }
  }

  onRunnerEnd(runner) {
    this.runners.push(runner);
    this.printReport(runner);
  }

  getMessage(runner) {
    const preface = `[${this.getEnviromentCombo(
      runner.capabilities,
      false,
      runner.isMultiremote,
    ).trim()} #${runner.cid}]`;
    const divider = '------------------------------------------------------------------';
    const results = this.getResultDisplay();
    if (results.length === 0) {
      return null;
    }
    const testLinks = runner.isMultiremote
      ? Object.entries(runner.capabilities).map(
        ([instanceName, capabilities]) => this.getTestLink({
          config: { ...runner.config, ...{ capabilities } },
          sessionId: capabilities.sessionId,
          isMultiremote: runner.isMultiremote,
          instanceName,
        }),
      )
      : this.getTestLink(runner);
    const output = [
      ...this.getHeaderDisplay(runner),
      '',
      ...results,
      ...this.getFailureDisplay(),
      ...(testLinks.length ? ['', ...testLinks] : []),
    ];
    const prefacedOutput = output.map((value) => (value ? `${preface} ${value}` : preface));
    return `${divider}\n${prefacedOutput}`;
  }

  printReport(globRunners) {
    const { runners } = this;
    if (runners && runners.length) {
      runners.forEach((runner, index) => {
        // determine correct file name given configuration for run
        if (index === 0) {
          const { cid, capabilities, config } = runner;
          const { browserName } = capabilities;
          this.fileNameCheck(config.launcherOptions, browserName, cid);
        }

        this.setTestModule(runner.specs[0]);

        if (!this.resultJsonObject.output[this.moduleName]) {
          this.resultJsonObject.output[this.moduleName] = [];
        }
        let readableMessage = this.getMessage(runner);
        const readableArrayMessage = readableMessage.toString().split(',');
        for (let i = 0; i < readableArrayMessage.length; i++) {
          readableArrayMessage[i] = stripAnsi(`${readableArrayMessage[i]}${endOfLine}`)
        }
        readableMessage = readableArrayMessage.join('');
        console.log('*************** ', readableMessage);
        this.resultJsonObject.output[this.moduleName].push(readableMessage);
        console.log('array disp :::::::: ', this.resultJsonObject.output[this.moduleName]);
        this.resultJsonObject.startDate = new Date(
          runner.start,
        ).toLocaleString();
        this.resultJsonObject.endDate = new Date(runner.end).toLocaleString();
      });
    }
    const {
      endDate, startDate, locale, formFactor, theme, output,
    } = this.resultJsonObject;

    const moduleKeys = Object.keys(output) || [];
    if (output && moduleKeys.length) {
      moduleKeys.forEach((key) => {
        const fileData = {
          startDate,
          locale,
          theme,
          formFactor,
          output: output[key],
          endDate,
        };

        const filePathLocation = path.join(
          this.resultsDir,
          `${this.fileName}-${key}.json`,
        );
        fs.writeFileSync(
          filePathLocation,
          `${JSON.stringify(fileData, null, 2)}`,
          { flag: 'w+' },
          (err) => {
            if (err) {
              Logger.error(err.message, { context: LOG_CONTEXT });
            }
          },
        );
      });
    }
  }
}

module.exports = FileOutputReporter;

