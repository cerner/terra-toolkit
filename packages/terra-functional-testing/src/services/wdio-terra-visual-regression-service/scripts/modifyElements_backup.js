export default function modifyElements() {
  // eslint-disable-next-line func-names, space-before-function-paren, prefer-arrow-callback, prefer-rest-params
  const args = Array.prototype.slice.call(arguments).filter(function(n) {
    return !!n || n === '';
  });
  const style = args[args.length - 2];
  const value = args[args.length - 1];

  args.splice(-2);
  for (let i = 0; i < args.length; i += 1) {
    for (let j = 0; j < args[i].length; j += 1) {
      const element = args[i][j];

      try {
        element.style.setProperty(style, value, 'important');
      } catch (error) {
      // eslint-disable-next-line prefer-template
        element.setAttribute('style', element.style.cssText + style + ':' + value + '!important;');
      }
    }
  }
}
