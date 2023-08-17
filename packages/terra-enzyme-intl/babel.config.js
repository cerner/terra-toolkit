module.exports = (api) => {
  api.cache(false);
  api.assertVersion('^7.4.4');

  return {
    presets: [
      ['@babel/preset-env', { useBuiltIns: 'entry', corejs: { version: 3.6, proposals: true } }],
      '@babel/preset-react',
    ],
  };
};
