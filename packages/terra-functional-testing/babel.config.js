module.exports = (api) => {
  api.cache(false);
  api.assertVersion('^7.4.4');

  const presets = [
    '@babel/preset-env',
  ];

  const plugins = [
    '@babel/plugin-syntax-async-generators',
    '@babel/transform-regenerator',
    '@babel/transform-runtime',
    '@babel/plugin-proposal-object-rest-spread',
  ];

  return {
    presets,
    plugins,
  };
};
