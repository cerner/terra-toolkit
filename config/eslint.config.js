module.exports = {
  "extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import",
    "compat"
  ],
  "env": {
    "browser": true,
    "jest": true
  },
  "rules": {
    "max-len": "off", // Remove warnings on max line length exceeding 100 characters
    "react/require-default-props": "off", // Disabled the requirement to default all non-required props
    "compat/compat": "warn"
  },
  "globals": {
    "shallow": true,
    "render": true,
    "mount": true
  },
};
