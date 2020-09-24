const RemoveCssModulesPseudoClasses = require('../../../lib/postcss/_removeCssModulesPseudoClasses');

describe('Remove Css Modules Pseudo Classes', () => {
  it('removes nothing', () => {
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

  it('removes local on multiple selectors', () => {
    const selector = ':local .selectorA, :local .selectorB';
    const expectedSelector = '.selectorA, .selectorB';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });

  it('removes local from this weird selector', () => {
    const selector = '.selectorA :local .selectorB';
    const expectedSelector = '.selectorA .selectorB';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });

  it('removes local end', () => {
    const selector = '.selector :local';
    const expectedSelector = '.selector';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });

  it('removes before and after pseudo selectors', () => {
    const selector = ':global .selector :root :local';
    const expectedSelector = '.selector';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });

  it('removes global', () => {
    const selector = ':global .selector';
    const expectedSelector = '.selector';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });

  it('removes global nested', () => {
    const selector = ':global(.selector)';
    const expectedSelector = '.selector';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });

  it('removes global on multiple selectors', () => {
    const selector = ':global .selectorA, :global .selectorB';
    const expectedSelector = '.selectorA, .selectorB';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });

  it('removes global from this weird selector', () => {
    const selector = '.selectorA :global .selectorB';
    const expectedSelector = '.selectorA .selectorB';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });

  it('removes global end', () => {
    const selector = '.selector :global';
    const expectedSelector = '.selector';
    expect(RemoveCssModulesPseudoClasses(selector)).toEqual(expectedSelector);
  });
});
