const toMatchReference = require('../../../../src/commands/expect/toMatchReference');

global.Terra = {
  serviceOptions: {
    ignoreComparisonResults: false,
  },
};

describe('toMatchReference', () => {
  it('should pass if matches reference screenshot', () => {
    const receivedScreenshot = {
      isNewScreenshot: false,
      isSameDimensions: true,
      isWithinMismatchTolerance: true,
      misMatchPercentage: 0.10,
    };

    const result = toMatchReference(receivedScreenshot);

    expect(result.pass).toBe(true);
  });

  it('should pass for new screenshot', () => {
    const receivedScreenshot = {
      isNewScreenshot: true,
    };

    const result = toMatchReference(receivedScreenshot);

    expect(result.pass).toBe(true);
  });

  it('should not pass if not within mismatch tolerance', () => {
    const receivedScreenshot = {
      isNewScreenshot: false,
      isSameDimensions: true,
      isWithinMismatchTolerance: false,
      misMatchPercentage: 0.10,
    };

    const result = toMatchReference(receivedScreenshot);

    expect(result.pass).toBe(false);
  });

  it('should not pass if not same dimension', () => {
    const receivedScreenshot = {
      isNewScreenshot: false,
      isSameDimensions: false,
      isWithinMismatchTolerance: true,
      misMatchPercentage: 0.10,
    };

    const result = toMatchReference(receivedScreenshot);

    expect(result.pass).toBe(false);
  });

  it('should return a message function that indicates the reason for the assertion failure', () => {
    const receivedScreenshot = {
      isSameDimensions: false,
      misMatchPercentage: 0.10,
    };

    const result = toMatchReference(receivedScreenshot);

    const comparisonResult = `${JSON.stringify(receivedScreenshot, null, 2)}`;

    expect(result.message()).toEqual(`expected to be within the mismatch tolerance, but received the following comparison results \n${comparisonResult}`);
  });
});
