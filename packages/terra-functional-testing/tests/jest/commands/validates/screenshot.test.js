const { screenshot } = require('../../../../src/commands/validates');

describe('screenshot', () => {
  it('should throw error when no test name is provided', () => {
    try {
      screenshot();
    } catch (error) {
      expect(error.message).toEqual('[terra-functional-testing:screenshot] Terra.validate.screenshot requires a unique test name as the first argument.');
    }
  });

  it('should throw error when an empty test name is provided', () => {
    try {
      screenshot('');
    } catch (error) {
      expect(error.message).toEqual('[terra-functional-testing:screenshot] Terra.validate.screenshot requires a unique test name as the first argument.');
    }
  });

  it('should throw error when a non-string test name is provided', () => {
    try {
      screenshot({});
    } catch (error) {
      expect(error.message).toEqual('[terra-functional-testing:screenshot] Terra.validate.screenshot requires a unique test name as the first argument.');
    }
  });
});
