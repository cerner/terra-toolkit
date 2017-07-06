#!/usr/bin/env node

/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const shell = require('shelljs');
const path = require('path');

const processPath = path.resolve(path.join(__dirname, '/nightwatch-process.js'));
const toolkitDir = __dirname.split('/scripts')[0];
const configuration = path.resolve(path.join(toolkitDir, '/nightwatch.conf.js'));

const driver = process.argv[2] || 'default';

const script = `${processPath} --config ${configuration} -e ${driver}-tiny &&
                ${processPath} --config ${configuration} -e ${driver}-small &&
                ${processPath} --config ${configuration} -e ${driver}-medium &&
                ${processPath} --config ${configuration} -e ${driver}-large &&
                ${processPath} --config ${configuration} -e ${driver}-huge &&
                ${processPath} --config ${configuration} -e ${driver}-enormous`;

if (shell.exec(script).code !== 0) {
  shell.exit(1);
}

shell.exit(0);
