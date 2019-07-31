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
};

const methods = {
  setTheme,
};

export default methods;
