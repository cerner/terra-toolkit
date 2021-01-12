const setApplicationLocale = require('../../../../src/commands/utils/setApplicationLocale');
const dispatchCustomEvent = require('../../../../src/commands/utils/dispatchCustomEvent');

jest.mock('../../../../src/commands/utils/dispatchCustomEvent');

describe('setApplicationLocale', () => {
  it('executes dispatchCustomEvent with a specified locale', () => {
    setApplicationLocale('ar');
    const expectedEvent = {
      name: 'applicationBase.testOverride',
      metaData: { locale: 'ar' },
    };
    expect(dispatchCustomEvent).toHaveBeenCalledWith(expectedEvent);
  });
});
