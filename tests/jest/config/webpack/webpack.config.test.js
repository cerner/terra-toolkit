jest.mock('terra-aggregate-translations');
jest.mock('postcss-assets-webpack-plugin');
jest.mock('postcss-custom-properties');
jest.mock('mini-css-extract-plugin');
jest.mock('clean-webpack-plugin');
jest.mock('terser-webpack-plugin');
jest.mock('webpack/lib/DefinePlugin');

// Import mocked components
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const PostCSSCustomProperties = require('postcss-custom-properties');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const aggregateTranslations = require('terra-aggregate-translations');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const webpackConfig = require('../../../../config/webpack/webpack.config');

const outputPath = expect.stringContaining('build');

const mockDate = 1571689941977;

describe('webpack config', () => {
  let config;
  afterEach(() => aggregateTranslations.mockReset());

  describe('dev or prod config', () => {
    beforeAll(() => {
      jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
      config = webpackConfig();
    });

    it('aggregates translations by default', () => {
      expect(aggregateTranslations).toBeCalled();
    });

    it('add the polyfills as default entries', () => {
      expect(config).toHaveProperty('entry');
      expect(config.entry).toMatchObject({
        raf: 'raf/polyfill',
        'core-js': 'core-js/stable',
        'regenerator-runtime': 'regenerator-runtime/runtime',
      });
    });

    it('add the module rules', () => {
      expect(config).toHaveProperty('module');
      expect(config).toHaveProperty('module.rules');
      expect(config.module.rules).toHaveLength(4);

      const cssLoaders = [
        expect.objectContaining({ loader: expect.stringContaining('mini-css-extract-plugin/dist/loader.js') }),
        expect.objectContaining({ loader: 'css-loader' }),
        expect.objectContaining({ loader: 'postcss-loader' }),
        expect.objectContaining({ loader: 'sass-loader' }),
      ];

      const moduleRules = [
        expect.objectContaining({ use: expect.objectContaining({ loader: 'babel-loader' }) }),
        expect.objectContaining({ use: expect.arrayContaining(cssLoaders) }),
        expect.objectContaining({ use: 'raw-loader' }),
        expect.objectContaining({ use: 'file-loader' }),
      ];

      expect(config.module.rules).toEqual(expect.arrayContaining(moduleRules));
    });

    it('adds the plugins', () => {
      expect(config).toHaveProperty('plugins');
      expect(config.plugins).toHaveLength(4);

      expect(MiniCssExtractPlugin).toBeCalledWith({
        chunkFilename: '[name].css',
        filename: '[name].css',
        ignoreOrder: true,
      });

      const postCSSAssetsPluginOptions = expect.objectContaining({
        plugins: [PostCSSCustomProperties()],
      });
      expect(PostCSSAssetsPlugin).toBeCalledWith(postCSSAssetsPluginOptions);

      const definePluginOptions = expect.objectContaining({
        CERNER_BUILD_TIMESTAMP: JSON.stringify(new Date(mockDate).toISOString()),
        TERRA_AGGREGATED_LOCALES: undefined,
      });
      expect(DefinePlugin).toBeCalledWith(definePluginOptions);
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

    it('does not include resolve alias', () => {
      expect(config).not.toHaveProperty('resolve.alias');
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
      expect(config.output).toHaveProperty('filename');
      expect(config.output).toHaveProperty('chunkFilename');
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
      expect(config).toHaveProperty('devtool', 'eval-source-map');
    });

    it('replace the output with dev config', () => {
      const expectedOuput = {
        filename: '[name].js',
        chunkFilename: '[name].js',
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

    it('adds the CleanWebpackPlugin', () => {
      expect(config).toHaveProperty('plugins');
      expect(config.plugins).toHaveLength(5);

      expect(MiniCssExtractPlugin).toBeCalledWith({
        chunkFilename: '[name].css',
        filename: '[name].css',
        ignoreOrder: true,
      });
      expect(PostCSSAssetsPlugin).toBeCalled();

      const definePluginOptions = expect.objectContaining({
        CERNER_BUILD_TIMESTAMP: JSON.stringify(new Date(mockDate).toISOString()),
        TERRA_AGGREGATED_LOCALES: undefined,
      });
      expect(DefinePlugin).toBeCalledWith(definePluginOptions);

      const cleanPluginOptions = expect.objectContaining({ cleanOnceBeforeBuildPatterns: expect.arrayContaining(['!stats.json']) });

      expect(CleanWebpackPlugin).toBeCalledWith(cleanPluginOptions);
    });

    it('removes devtool option', () => {
      expect(config).toHaveProperty('devtool', false);
    });

    it('replace the output with prod config', () => {
      const expectedOuput = {
        filename: '[name]-[chunkhash].js',
        chunkFilename: '[name]-[chunkhash].js',
      };
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
      config = webpackConfig({ disableAggregateTranslations }, {});
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

    it('should add the TERRA_AGGREGATED_LOCALES global as undefined if locale aggregation is disabled', () => {
      const expected = {
        CERNER_BUILD_TIMESTAMP: JSON.stringify(new Date(mockDate).toISOString()),
        TERRA_AGGREGATED_LOCALES: undefined,
      };
      expect(DefinePlugin).toBeCalledWith(expected);
    });
  });

  describe('accepts aggregateOptions env variable', () => {
    const aggregateOptions = { baseDir: 'test/dir', locales: ['en', 'es', 'pl'] };
    beforeAll(() => {
      aggregateTranslations.mockImplementation(() => aggregateOptions.locales);
      config = webpackConfig({ aggregateOptions }, {});
    });

    it('and it aggregates translations with these options', () => {
      expect(aggregateTranslations).toBeCalledWith(expect.objectContaining(aggregateOptions));
    });

    it('should add the TERRA_AGGREGATED_LOCALES global with the translation locale options', () => {
      const expected = {
        CERNER_BUILD_TIMESTAMP: JSON.stringify(new Date(mockDate).toISOString()),
        TERRA_AGGREGATED_LOCALES: JSON.stringify(aggregateOptions.locales),
      };
      expect(DefinePlugin).toBeCalledWith(expected);
    });
  });

  describe('accepts disableHotReloading env variable', () => {
    const disableHotReloading = true;
    beforeAll(() => {
      config = webpackConfig({ disableHotReloading }, {});
    });

    it('and adds to dev server options', () => {
      const expectedOuput = {
        hot: false,
        inline: false,
        host: '0.0.0.0',
        stats: {
          colors: true,
          children: false,
        },
      };
      expect(config.devServer).toEqual(expect.objectContaining(expectedOuput));
    });
  });
});
