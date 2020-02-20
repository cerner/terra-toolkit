const fs = require('fs-extra');
const path = require('path');
const postcss = require('postcss');

const CONFIG = 'terra-theme.config.js';

module.exports = postcss.plugin('postcss-test-plugin', () => {
  let themeConfig = {};
  const defaultConfig = path.resolve(process.cwd(), CONFIG);
  if (fs.existsSync(defaultConfig)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    themeConfig = require(defaultConfig);
  }
  const defaultThemeSelector = `.${themeConfig.theme}`;

  return (root) => {
    if (defaultThemeSelector) {
      root.walk((decl) => {
        if (decl.selector === defaultThemeSelector) {
          const clone = decl.clone({ selector: ':root' });
          root.append(clone);
        }
      });
    }
  };
});
