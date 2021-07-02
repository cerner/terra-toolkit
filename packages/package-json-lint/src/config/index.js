const { cosmiconfig } = require('cosmiconfig');
const path = require('path');
const { Logger } = require('@cerner/terra-cli');

const logger = new Logger({ prefix: '[package-json-lint:config]' });

const loadFromModule = ({ moduleName, relativeDirectory }) => {
  const resolvedModule = require.resolve(moduleName, { paths: [relativeDirectory] });
  // eslint-disable-next-line import/no-dynamic-require, global-require
  return require(resolvedModule);
};

const applyExtends = ({ config, relativeDirectory }) => {
  const { extends: extendsAttribute, ...configWithoutExtends } = config;
  const arrayOfExtends = !Array.isArray(extendsAttribute) ? [extendsAttribute] : extendsAttribute;

  return arrayOfExtends.reduceRight((previousConfig, extendsModuleName) => {
    let extendedConfig = loadFromModule({ moduleName: extendsModuleName, relativeDirectory });
    if (extendedConfig.extends) {
      extendedConfig = applyExtends({ extendedConfig, relativeDirectory });
    }

    const mergedConfig = { ...extendedConfig, ...previousConfig };
    const mergedRules = { ...extendedConfig.rules, ...previousConfig.rules };
    mergedConfig.rules = mergedRules;

    return mergedConfig;
  }, configWithoutExtends);
};

const getConfigForFile = async ({ packageJsonPath }) => {
  const config = await cosmiconfig('package-json-lint').search(path.dirname(packageJsonPath));
  if (!config) {
    logger.warn(`No configuration specified for ${packageJsonPath}`);
    return { };
  }
  const { config: configForFile, filepath } = config;
  if (configForFile.extends) {
    return applyExtends({ config: configForFile, relativeDirectory: path.dirname(filepath) });
  }
  return configForFile;
};

const getRuleConfig = ({ ruleInformation }) => (
  { severity: ruleInformation }
);

module.exports = {
  getConfigForFile,
  getRuleConfig,
};
