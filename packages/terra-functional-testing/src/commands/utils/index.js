const cleanScreenshots = require('./cleanScreenshots');
const describeTests = require('./describeTests');
const describeViewports = require('./describeViewports');
const dispatchCustomEvent = require('./dispatchCustomEvent');
const downloadScreenshots = require('./downloadScreenshots');
const getViewports = require('./getViewports');
const hideInputCaret = require('./hideInputCaret');
const setApplicationLocale = require('./setApplicationLocale');
const setViewport = require('./setViewport');
const eventEmitter = require('./eventEmitter');

module.exports = {
  cleanScreenshots,
  describeTests,
  describeViewports,
  dispatchCustomEvent,
  downloadScreenshots,
  eventEmitter,
  getViewports,
  hideInputCaret,
  setApplicationLocale,
  setViewport,
};
