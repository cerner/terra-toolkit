/* eslint-disable no-restricted-syntax, no-await-in-loop, prefer-const */

// eslint-disable-next-line
const getViewportSize = async function() {
  // eslint-disable-next-line
  const res = await browser.execute(function() {
    return {
      screenWidth: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      screenHeight: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    };
  });
  return {
    width: res.screenWidth,
    height: res.screenHeight,
  };
};

export async function mapViewports(browser, viewportChangePause, viewports = [], takeScreenshot, processScreenshot) {
  const results = [];

  if (!viewports.length) {
    const viewport = await getViewportSize();
    const params = await takeScreenshot(viewport);
    results.push(processScreenshot(...params));
  } else {
    for (let viewport of viewports) {
      await browser.setWindowSize(viewport.width, viewport.height);
      await browser.pause(viewportChangePause);
      const params = await takeScreenshot(viewport);
      results.push(processScreenshot(...params));
    }
  }

  return Promise.all(results);
}

export async function mapOrientations(browser, viewportChangePause, orientations = [], takeScreenshot, processScreenshot) {
  const results = [];

  if (!orientations.length) {
    const orientation = await browser.getOrientation();
    const params = await takeScreenshot(orientation);
    results.push(processScreenshot(...params));
  } else {
    for (let orientation of orientations) {
      await browser.setOrientation(orientation);
      await browser.pause(viewportChangePause);
      const params = await takeScreenshot(orientation);
      results.push(processScreenshot(...params));
    }
  }

  return Promise.all(results);
}
