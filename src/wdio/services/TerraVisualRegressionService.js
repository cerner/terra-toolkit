import VisualRegressionLauncher from 'wdio-visual-regression-service/lib/VisualRegressionLauncher';

export default class TerraVisualRegressionService extends VisualRegressionLauncher {
  beforeSuite(suite) {
    console.log(`Before Suite: ${JSON.stringify(suite, undefined, 2)}`);
    this.currentSuite = suite;
  }

  afterSuite(suite) {
    console.log(`After Suite: ${JSON.stringify(suite, undefined, 2)}`);
    this.currentSuite = null;
  }

  beforeTest(test) {
    console.log(`Before Test: ${JSON.stringify(test, undefined, 2)}`);
    this.currentTest = test;
  }

  afterTest(test) {
    console.log(`After Test: ${JSON.stringify(test, undefined, 2)}`);
    this.currentTest = null;
  }

  beforeFeature(feature) {
    this.currentFeature = feature;
  }

  afterFeature() {
    this.currentFeature = null;
  }

  beforeScenario(scenario) {
    console.log(`Before Scenario: ${JSON.stringify(scenario, undefined, 2)}`);
    this.currentScenario = scenario;
  }

  afterScenario(scenario) {
    console.log(`After Scenario: ${JSON.stringify(scenario, undefined, 2)}`);
    this.currentScenario = null;
  }

  beforeStep(step) {
    this.currentStep = step;
  }

  afterStep() {
    this.currentStep = null;
  }
}
