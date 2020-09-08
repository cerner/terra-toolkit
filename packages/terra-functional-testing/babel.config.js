module.exports = (api) => {
  api.cache(false);
  api.assertVersion('^7.4.4');

  // mocha doesn't support import syntax -.- (will be updating to jest soon...)
  const mochaTestFiles = [];
  if (process.env.MOCHA === 'true') {
    mochaTestFiles.push('./src/services/wdio-visual-regression-service/**');
    mochaTestFiles.push('./tests/mocha/**');
  }

  return {
    include: [
      './src/services/wdio-visual-regression-service/modules/**',
      './src/services/wdio-visual-regression-service/scripts/**',
      './src/services/wdio-visual-regression-service/utils/**',
    ].concat(mochaTestFiles),
    presets: [
      '@babel/preset-env',
    ],
    plugins: [
      '@babel/plugin-syntax-async-generators',
      '@babel/transform-regenerator',
      '@babel/transform-runtime',
      '@babel/plugin-proposal-object-rest-spread',
    ],
  };
};
