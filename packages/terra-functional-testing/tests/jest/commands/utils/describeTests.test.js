const { describeViewports, describeTests } = require('../../../../src/commands/utils');

jest.mock('../../../../src/commands/utils/describeViewports');

global.Terra = {
  serviceOptions: {
    formFactor: 'tiny',
    locale: 'fr',
    theme: 'clinical-lowlight-theme',
  },
};

describe('describeTests', () => {
  it('should describe tests with empty options', () => {
    const test = () => {};
    describeTests('describeTests', {}, test);

    expect(describeViewports).toHaveBeenCalledWith('describeTests', ['huge'], test);
  });

  it('should describe tests with matching form factor', () => {
    const test = () => {};
    describeTests('describeTests', { formFactors: ['tiny', 'small'] }, test);

    expect(describeViewports).toHaveBeenCalledWith('describeTests', ['tiny', 'small'], test);
  });

  it('should describe tests with non-matching form factor', () => {
    describeTests('describeTests', { formFactors: ['large', 'small'] }, () => {});

    expect(describeViewports).not.toHaveBeenCalled();
  });

  it('should describe tests with matching locale', () => {
    const test = () => {};
    describeTests('describeTests', { locales: ['en', 'fr'] }, test);

    expect(describeViewports).toHaveBeenCalledWith('describeTests', ['huge'], test);
  });

  it('should describe tests with non-matching locale', () => {
    describeTests('describeTests', { locales: ['en'] }, () => {});

    expect(describeViewports).not.toHaveBeenCalled();
  });

  it('should describe tests with matching theme', () => {
    const test = () => {};
    describeTests('describeTests', { themes: ['terra-default-theme', 'clinical-lowlight-theme'] }, test);

    expect(describeViewports).toHaveBeenCalledWith('describeTests', ['huge'], test);
  });

  it('should describe tests with non-matching theme', () => {
    describeTests('describeTests', { themes: ['terra-default-theme'] }, () => {});

    expect(describeViewports).not.toHaveBeenCalled();
  });

  it('should describe tests with matching form factor, locale, and theme', () => {
    const test = () => {};
    const options = {
      formFactors: ['tiny', 'small'],
      locales: ['en', 'fr'],
      themes: ['terra-default-theme', 'clinical-lowlight-theme'],
    };

    describeTests('describeTests', options, test);

    expect(describeViewports).toHaveBeenCalledWith('describeTests', ['tiny', 'small'], test);
  });

  it('should describe tests with no matching options', () => {
    const options = {
      formFactors: ['small'],
      locales: ['en'],
      themes: ['terra-default-theme'],
    };

    describeTests('describeTests', options, () => {});

    expect(describeViewports).not.toHaveBeenCalled();
  });
});
