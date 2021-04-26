const { setApplicationLocale, dispatchCustomEvent } = require('../../../../src/commands/utils');

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
