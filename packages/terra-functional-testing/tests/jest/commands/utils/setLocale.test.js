const setLocale = require('../../../../src/commands/utils/setLocale');
const dispatchCustomEvent = require('../../../../src/commands/utils/dispatchCustomEvent');

jest.mock('../../../../src/commands/utils/dispatchCustomEvent');

describe('setLocale', () => {
  it('executes dispatchCustomEvent with a specified locale', () => {
    setLocale('ar');
    const expectedEvent = {
      name: 'applicationBase.testOverride',
      metaData: { locale: 'ar' },
    };
    expect(dispatchCustomEvent).toHaveBeenCalledWith(expectedEvent);
  });
});
