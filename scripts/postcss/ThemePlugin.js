const postcss = require('postcss');

module.exports = postcss.plugin('postcss-test-plugin', () => (root) => {
  root.walk((node) => {
    console.log(node.toString);
  });
});
