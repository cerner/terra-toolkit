const Tokenizer = require('css-selector-tokenizer');

/**
 * Remove the css modules pseudo classes from a selector string.
 */
module.exports = (selector) => {
  // bail quick if it's not an explicit css module node
  if (!selector.startsWith(':local') && !selector.startsWith(':global')) {
    return selector;
  }

  const node = Tokenizer.parse(selector);
  node.nodes.forEach(item => {
    // The first node is expected be the css modules node.
    const firstNode = item.nodes[0];
    const nodeNames = ['local', 'global'];
    // Pop off the first node
    if (firstNode && firstNode.type === 'pseudo-class' && nodeNames.includes(firstNode.name)) {
      // remove the pseudo selector and the following space.
      item.nodes.splice(0, 2);
    }
    // Return the inner node
    if (firstNode && firstNode.type === 'nested-pseudo-class' && nodeNames.includes(firstNode.name)) {
      // replace the pseudo selector for the nested node.
      // eslint-disable-next-line no-param-reassign
      item.nodes = firstNode.nodes;
    }
  });

  return Tokenizer.stringify(node);
};

