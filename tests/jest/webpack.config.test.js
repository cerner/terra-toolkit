jest.mock('../../scripts/aggregate-translations/aggregate-translations');
jest.mock('postcss-assets-webpack-plugin');
jest.mock('postcss-custom-properties');
jest.mock('mini-css-extract-plugin');
jest.mock('clean-webpack-plugin');
jest.mock('terser-webpack-plugin');

const path = require('path');

// Import mocked components
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const PostCSSCustomProperties = require('postcss-custom-properties');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const aggregateTranslations = require('../../scripts/aggregate-translations/aggregate-translations');
const webpackConfig = require('../../config/webpack/webpack.config');

const outputPath = expect.stringContaining('build');

describe('webpack config', () => {
  let config;
  afterEach(() => aggregateTranslations.mockReset());

  describe('dev or prod config', () => {
    beforeAll(() => {
      config = webpackConfig();
    });

    it('aggregates translations by defualt', () => {
      expect(aggregateTranslations).toBeCalled();
    });

    it('add the polyfills as default entries', () => {
      expect(config).toHaveProperty('entry');
      expect(config.entry).toMatchObject({
        raf: 'raf/polyfill',
        'babel-polyfill': 'babel-polyfill',
      });
    });

    it('add the module rules', () => {
      expect(config).toHaveProperty('module');
      expect(config).toHaveProperty('module.rules');
      expect(config.module.rules).toHaveLength(4);

      const cssLoaders = [
        expect.stringContaining('mini-css-extract-plugin/dist/loader.js'),
        expect.objectContaining({ loader: 'css-loader' }),
        expect.objectContaining({ loader: 'postcss-loader' }),
        expect.objectContaining({ loader: 'sass-loader' }),
      ];

      const moduleRules = [
        expect.objectContaining({ use: 'babel-loader' }),
        expect.objectContaining({ use: expect.arrayContaining(cssLoaders) }),
        expect.objectContaining({ use: 'raw-loader' }),
        expect.objectContaining({ use: 'file-loader' }),
      ];

      expect(config.module.rules).toEqual(expect.arrayContaining(moduleRules));
    });

    it('adds the plugins', () => {
      expect(config).toHaveProperty('plugins');
      expect(config.plugins).toHaveLength(2);

      expect(MiniCssExtractPlugin).toBeCalled();

      const postCSSAssetsPluginOptions = expect.objectContaining({
        plugins: [PostCSSCustomProperties()],
      });
      expect(PostCSSAssetsPlugin).toBeCalledWith(postCSSAssetsPluginOptions);
    });

    it('adds resolve extensions', () => {
      const expectedExtensions = ['.js', '.jsx'];

      expect(config).toHaveProperty('resolve');
      expect(config).toHaveProperty('resolve.extensions', expectedExtensions);
    });

    it('adds resolve modules', () => {
      const expectedModules = expect.arrayContaining([
        expect.stringContaining('aggregated-translations'),
        expect.stringContaining('node_modules'),
      ]);

      expect(config).toHaveProperty('resolve');
      expect(config).toHaveProperty('resolve.modules', expectedModules);
    });

    it('adds resolve alias', () => {
      const reactAlias = expect.stringContaining(path.join('node_modules', 'react'));
      const reactIntlAlias = expect.stringContaining(path.join('node_modules', 'react-intl'));
      const reactDomAlias = expect.stringContaining(path.join('node_modules', 'react-dom'));

      expect(config).toHaveProperty('resolve.alias');
      expect(config.resolve.alias).toHaveProperty('react', reactAlias);
      expect(config.resolve.alias).toHaveProperty('react-intl', reactIntlAlias);
      expect(config.resolve.alias).toHaveProperty('react-dom', reactDomAlias);
    });

    it('adds a module resolver loader', () => {
      const expectedModules = expect.arrayContaining([
        expect.stringContaining('node_modules'),
      ]);

      expect(config).toHaveProperty('resolveLoader');
      expect(config).toHaveProperty('resolveLoader.modules');
      expect(config.resolveLoader.modules).toHaveLength(1);
      expect(config.resolveLoader.modules).toEqual(expectedModules);
    });

    it('add the output config', () => {
      expect(config).toHaveProperty('output');
      expect(config.output).toHaveProperty('path', outputPath);
      expect(config.output).toHaveProperty('publicPath', '');
    });

    it('disabled stats on children', () => {
      expect(config).toHaveProperty('stats', expect.objectContaining({ children: false }));
    });
  });

  describe('dev webpack config specifics', () => {
    beforeAll(() => {
      config = webpackConfig({}, {});
    });

    it('sets configuration mode to production', () => {
      expect(config).toHaveProperty('mode', 'development');
    });

    it('add devtool option', () => {
      expect(config).toHaveProperty('devtool', 'cheap-source-map');
    });

    it('replace the output with dev config', () => {
      const expectedOuput = {
        filename: '[name].js',
      };
      expect(config.output).toEqual(expect.objectContaining(expectedOuput));
    });
  });

  describe('prod webpack config specifics', () => {
    beforeAll(() => {
      config = webpackConfig({}, { p: true });
    });

    it('sets configuration mode to production', () => {
      expect(config).toHaveProperty('mode', 'production');
    });

    it('adds the CleanPlugin', () => {
      expect(config).toHaveProperty('plugins');
      expect(config.plugins).toHaveLength(3);

      expect(MiniCssExtractPlugin).toBeCalled();
      expect(PostCSSAssetsPlugin).toBeCalled();

      const cleanPluginOptions = expect.objectContaining({ exclude: ['stats.json'] });

      expect(CleanPlugin).toBeCalledWith(outputPath, cleanPluginOptions);
    });

    it('removes devtool option', () => {
      expect(config).toHaveProperty('devtool', false);
    });

    it('replace the output with prod config', () => {
      const expectedOuput = { filename: '[name]-[chunkhash].js' };
      expect(config.output).toEqual(expect.objectContaining(expectedOuput));
    });

    it('optimizes production assets', () => {
      expect(config.optimization).toHaveProperty('minimizer');
      expect(config.optimization.minimizer).toHaveLength(1);
      expect(TerserPlugin).toBeCalled();
    });
  });

  describe('accepts disableAggregateTranslations env variable', () => {
    const disableAggregateTranslations = true;
    beforeAll(() => {
      config = webpackConfig({ disableAggregateTranslations }, { });
    });

    it('and it does not aggregate translations', () => {
      expect(aggregateTranslations).not.toBeCalled();
    });

    it('and it does not add aggregated-translations to resolve modules', () => {
      const expectedModules = expect.arrayContaining([
        expect.stringContaining('aggregated-translations'),
      ]);

      expect(config.resolve.modules).toHaveLength(1);
      expect(config.resolveLoader.modules).not.toEqual(expectedModules);
    });
  });

  describe('accepts aggregateOptions env variable', () => {
    const aggregateOptions = { baseDirectory: 'test/dir' };
    beforeAll(() => {
      config = webpackConfig({ aggregateOptions }, { });
    });

    it('and it aggregates translations with these options', () => {
      expect(aggregateTranslations).toBeCalledWith(expect.objectContaining(aggregateOptions));
    });
  });
});
