const cleanScreenshots = require('./cleanScreenshots');
const describeTests = require('./describeTests');
const describeViewports = require('./describeViewports');
const dispatchCustomEvent = require('./dispatchCustomEvent');
const downloadScreenshots = require('./downloadScreenshots');
const eventEmitter = require('./eventEmitter');
const getViewports = require('./getViewports');
const getViewportSize = require('./getViewportSize');
const hideInputCaret = require('./hideInputCaret');
const setApplicationLocale = require('./setApplicationLocale');
const setViewport = require('./setViewport');
const setViewportSize = require('./setViewportSize');

module.exports = {
  cleanScreenshots,
  describeTests,
  describeViewports,
  dispatchCustomEvent,
  downloadScreenshots,
  eventEmitter,
  getViewports,
  getViewportSize,
  hideInputCaret,
  setApplicationLocale,
  setViewport,
  setViewportSize,
};
