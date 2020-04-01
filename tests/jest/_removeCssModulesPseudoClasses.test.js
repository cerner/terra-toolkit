const RemoveCssModulesPseudoClasses = require('../../scripts/postcss/_removeCssModulesPseudoClasses');

describe('Remove Css Modules Pseudo Classes', () => {
  it('bails', () => {
    const selector = '.selector';
    const expectedSelector = '.selector';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });

  it('removes local', () => {
    const selector = ':local .selector';
    const expectedSelector = '.selector';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });

  it('removes local nested', () => {
    const selector = ':local(.selector)';
    const expectedSelector = '.selector';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });

  it('removes local nested', () => {
    const selector = ':local .selectorA, :local .selectorB';
    const expectedSelector = '.selectorA, .selectorB';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });

  it('removes global', () => {
    const selector = ':global .selector';
    const expectedSelector = '.selector';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });

  it('removes local nested', () => {
    const selector = ':global(.selector)';
    const expectedSelector = '.selector';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });

  it('removes local nested', () => {
    const selector = ':global .selectorA, :global .selectorB';
    const expectedSelector = '.selectorA, .selectorB';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });
});
