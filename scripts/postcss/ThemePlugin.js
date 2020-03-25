const fs = require('fs-extra');
const path = require('path');
const postcss = require('postcss');

const CONFIG = 'terra-theme.config.js';
const SUPPORTED_THEMES = [
  'orion-fusion-theme',
  'clinical-lowlight-theme',
  'cerner-clinical-theme',
];

/**
 * The purpose of this plugin is to create a default theme from a scoped theme
 * and to remove any supported themes that are not desired.
 */
module.exports = postcss.plugin('postcss-test-plugin', (config) => {
  // Retrieve theme config.
  let themeConfig = {};
  if (config) {
    themeConfig = config;
  } else {
    const defaultConfig = path.resolve(process.cwd(), CONFIG);
    if (fs.existsSync(defaultConfig)) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      themeConfig = require(defaultConfig);
    }
  }

  // Add the . to find the selector.
  const defaultThemeSelector = `.${themeConfig.theme}`;

  const scopedThemes = themeConfig.scoped || [];

  // Find the set of known themes that should not be included.
  const themesToRemove = SUPPORTED_THEMES.reduce((acc, theme) => {
    if (!scopedThemes.includes(theme)) {
      acc.push(`.${theme}`);
    }
    return acc;
  }, []);

  return (root) => {
    if (defaultThemeSelector || themesToRemove.length) {
      root.walk((node) => {
        // Clone the default theme node and apply as root.
        if (node.selector === defaultThemeSelector) {
          const clone = node.clone({ selector: ':root' });
          root.append(clone);
        }

        // Remove the undesired theme node from it's parent.
        if (themesToRemove.includes(node.selector)) {
          node.parent.removeChild(node);
        }
      });
    }
  };
});
