module.exports = {
  "extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "env": {
    "browser": true,
    "jest": true
  },
  "plugins": [
    "compat"
  ],
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
