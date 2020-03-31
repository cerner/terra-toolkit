const fs = require('fs-extra');
const path = require('path');
const postcss = require('postcss');
const Tokenizer = require('css-selector-tokenizer');

const CONFIG = 'terra-theme.config.js';
const SUPPORTED_THEMES = [
  'orion-fusion-theme',
  'clinical-lowlight-theme',
  'cerner-clinical-theme',
];

const removeCssModulesPseudoClasses = (selector) => {
  // bail quick if it's not an explicit css module node
  if (!selector.startsWith(':local') && !selector.startsWith(':global')) {
    return selector;
  }

  const node = Tokenizer.parse(selector);
  node.nodes.forEach(item => {
    const firstNode = item.nodes[0];
    const nodeNames = ['local', 'global'];
    // Pop off the first node
    if (firstNode && firstNode.type === 'pseudo-class' && nodeNames.includes(firstNode.name)) {
      item.nodes.splice(0, 2);
    }
    // Return the inner node
    if (firstNode && firstNode.type === 'nested-pseudo-class' && nodeNames.includes(firstNode.name)) {
      // eslint-disable-next-line no-param-reassign
      item.nodes = firstNode.nodes;
    }
  });

  return Tokenizer.stringify(node);
};

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
      root.walkRules((node) => {
        const selector = removeCssModulesPseudoClasses(node.selector);
        // Clone the default theme node and apply as root.
        if (selector === defaultThemeSelector) {
          const clone = node.clone({ selector: ':root' });
          root.append(clone);
        }

        // Remove the undesired theme node from it's parent.
        if (themesToRemove.includes(selector)) {
          node.parent.removeChild(node);
        }
      });
    }
  };
});
