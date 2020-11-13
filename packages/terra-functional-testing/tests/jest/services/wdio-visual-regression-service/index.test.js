import defaultLauncher, { launcher } from '../../../../src/services/wdio-visual-regression-service/index';

describe('index', () => {
  it('should export the launcher by default', () => {
    expect(defaultLauncher).toBeDefined();
  });

  it('should export the launcher as launcher', () => {
    expect(launcher).toBeDefined();
  });
});
