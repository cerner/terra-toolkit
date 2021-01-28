const toMatchReference = require('../../../../src/commands/expect/toMatchReference');

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

    const expectedMessage = 'Expected the screenshot to match the reference screenshot, but received a screenshot with different dimensions.\nExpected the screenshot to be within the mismatch tolerance, but received a mismatch difference of 0.1%.';

    expect(result.message()).toEqual(expectedMessage);
  });
});
