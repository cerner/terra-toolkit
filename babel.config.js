module.exports = (api) => {
  api.cache(false);
  api.assertVersion('^7.4.4');

  return {
    presets: [
      ['@babel/preset-env', { useBuiltIns: 'entry', corejs: { version: 3.6, proposals: true } }],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-syntax-async-generators',
      '@babel/transform-regenerator',
      '@babel/transform-runtime',
      '@babel/plugin-proposal-object-rest-spread',
    ],
  };
};
