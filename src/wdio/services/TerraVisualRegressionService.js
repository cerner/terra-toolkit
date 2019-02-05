import VisualRegressionLauncher from 'wdio-visual-regression-service/lib/VisualRegressionLauncher';

export default class TerraVisualRegressionService extends VisualRegressionLauncher {
  beforeSuite(suite) {
    this.currentSuite = suite;
  }

  afterSuite() {
    this.currentSuite = null;
  }

  beforeTest(test) {
    this.currentTest = test;
  }

  afterTest() {
    this.currentTest = null;
  }

  beforeFeature(feature) {
    this.currentFeature = feature;
  }

  afterFeature() {
    this.currentFeature = null;
  }

  beforeScenario(scenario) {
    this.currentScenario = scenario;
  }

  afterScenario() {
    this.currentScenario = null;
  }

  beforeStep(step) {
    this.currentStep = step;
  }

  afterStep() {
    this.currentStep = null;
  }
}
