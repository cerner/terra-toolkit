const path = require('path');
const fs = require('fs-extra');

// Don't override the config if the consumer is passing it in or if it is defined in a babel config file
if (!fs.pathExistsSync(path.join(process.cwd(), 'babel.config.js')) && !process.argv.some((element) => element.startsWith('--config-file'))) {
  process.argv = process.argv.concat(['--config-file', path.join(__dirname, '..', '..', 'config', 'index.js')]);
}

require('@babel/cli/lib/babel');
