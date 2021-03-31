const getConfig = async () => ({
  rules: {
    'require-no-terra-base-peer-dependency-versions': 'error',
    'require-theme-context-versions': 'error',
  },
});

const getRuleConfig = ({ ruleInformation }) => (
  { severity: ruleInformation }
);

module.exports = {
  getConfig,
  getRuleConfig,
};
