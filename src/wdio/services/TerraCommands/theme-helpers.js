import Logger from '../../../../scripts/utils/logger';

/**
* Applies the  scoped theme to root.
*
* @param {string} themeSelector - the scope theme selector.
*/
const setTheme = (themeSelector) => {
  if (themeSelector === 'default') {
    return;
  }

  let root = document.documentElement.className;
  root = `${root} ${themeSelector}`;

  global.browser.execute(root);
  Logger.log(`Applying ${themeSelector} to root.`);
}

/**
* Mocha `describe` block to set and loop themes.
*
* This is intended to be used as a root-level Mocha `describe`.
*
* @param {string} title - The `describe` block title.
* @param {string[]} themes - The list of Terra themes to tests.
* @param {function} - the test function to execute for each viewport.
*/
const describeThemes = (title, themes, fn) => {
  themes.forEach(theme => global.describe(`[${theme}]`, () => {
    global.before(() => setTheme(theme));
    globa.describe(title, fn);
  }));
};
const methods = {
  setTheme,
  describeThemes,
};

export default methods;
