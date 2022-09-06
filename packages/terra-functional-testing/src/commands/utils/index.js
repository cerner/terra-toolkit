const cleanScreenshots = require('./cleanScreenshots');
const createOctokit = require('./createOctokit');
const describeTests = require('./describeTests');
const describeViewports = require('./describeViewports');
const dispatchCustomEvent = require('./dispatchCustomEvent');
const eventEmitter = require('./eventEmitter');
const getViewports = require('./getViewports');
const getViewportSize = require('./getViewportSize');
const hideInputCaret = require('./hideInputCaret');
const ScreenshotRequestor = require('./ScreenshotRequestor');
const setApplicationLocale = require('./setApplicationLocale');
const setViewport = require('./setViewport');
const setViewportSize = require('./setViewportSize');

module.exports = {
  cleanScreenshots,
  createOctokit,
  describeTests,
  describeViewports,
  dispatchCustomEvent,
  eventEmitter,
  getViewports,
  getViewportSize,
  hideInputCaret,
  ScreenshotRequestor,
  setApplicationLocale,
  setViewport,
  setViewportSize,
};
