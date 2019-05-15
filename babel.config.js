module.exports = (api) => {
  api.cache(true);
  api.assertVersion('^7.4.4');

  const presets = [
    '@babel/preset-env',
  ];
  const plugins = [
    '@babel/plugin-transform-object-assign',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
  ];

  return {
    presets,
    plugins,
  };
};
