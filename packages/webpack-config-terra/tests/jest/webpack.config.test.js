jest.mock('terra-aggregate-translations');
jest.mock('postcss-assets-webpack-plugin');
jest.mock('postcss-custom-properties');
jest.mock('mini-css-extract-plugin');
jest.mock('clean-webpack-plugin');
jest.mock('terser-webpack-plugin');
jest.mock('webpack/lib/DefinePlugin');
jest.mock('../../lib/utils/_getThemeConfig');

// Import mocked components
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin');
const PostCSSCustomProperties = require('postcss-custom-properties');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const aggregateTranslations = require('terra-aggregate-translations');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const webpackConfig = require('../../webpack.config');
const getThemeConfig = require('../../lib/utils/_getThemeConfig');

const outputPath = expect.stringContaining('build');

getThemeConfig.mockImplementation(() => ({ }));

const mockDate = 1571689941977;

describe('webpack config', () => {
  afterEach(() => aggregateTranslations.mockReset());

  it('Executes config dev or prod config', () => {
    jest.spyOn(Date, 'now').mockImplementation(() => mockDate);
    const config = webpackConfig();

    // aggregates translations by default
    expect(aggregateTranslations).toBeCalled();

    // add the polyfills as default entries
    expect(config).toHaveProperty('entry');
    expect(config.entry).toMatchObject({
      'core-js': '@cerner/webpack-config-terra/lib/entry/core-js',
      'regenerator-runtime': 'regenerator-runtime/runtime',
    });

    // add the module rules
    expect(config).toHaveProperty('module');
    expect(config).toHaveProperty('module.rules');
    expect(config.module.rules[0].oneOf).toHaveLength(4);

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

    expect(config.module.rules[0].oneOf).toEqual(expect.arrayContaining(moduleRules));

    // adds the plugins
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
      TERRA_THEME_CONFIG: JSON.stringify({}),
    });
    expect(DefinePlugin).toBeCalledWith(definePluginOptions);

    //  adds resolve extensions
    const expectedExtensions = ['.js', '.jsx'];

    expect(config).toHaveProperty('resolve');
    expect(config).toHaveProperty('resolve.extensions', expectedExtensions);

    // adds resolve modules
    const expectedModules = expect.arrayContaining([
      expect.stringContaining('aggregated-translations'),
      expect.stringContaining('node_modules'),
    ]);

    expect(config).toHaveProperty('resolve');
    expect(config).toHaveProperty('resolve.modules', expectedModules);

    // does not include resolve alias
    expect(config).not.toHaveProperty('resolve.alias');

    // adds a module resolver loader
    const expectedResolveLoaderModules = expect.arrayContaining([
      expect.stringContaining('node_modules'),
    ]);

    expect(config).toHaveProperty('resolveLoader');
    expect(config).toHaveProperty('resolveLoader.modules');
    expect(config.resolveLoader.modules).toHaveLength(1);
    expect(config.resolveLoader.modules).toEqual(expectedResolveLoaderModules);

    // add the output config
    expect(config).toHaveProperty('output');
    expect(config.output).toHaveProperty('filename');
    expect(config.output).toHaveProperty('chunkFilename');
    expect(config.output).toHaveProperty('path', outputPath);
    expect(config.output).toHaveProperty('publicPath', '');

    // disabled stats on children
    expect(config).toHaveProperty('stats', expect.objectContaining({ children: false }));
  });

  it('executes dev webpack config specifics', () => {
    const config = webpackConfig({}, {});

    // sets configuration mode to production
    expect(config).toHaveProperty('mode', 'development');

    // add devtool option
    expect(config).toHaveProperty('devtool', 'eval-source-map');

    // replace the output with dev config
    const expectedOuput = {
      filename: '[name].js',
      chunkFilename: '[name].js',
    };
    expect(config.output).toEqual(expect.objectContaining(expectedOuput));
  });

  it('executes prod webpack config specifics', () => {
    const config = webpackConfig({}, { p: true });

    // sets configuration mode to production
    expect(config).toHaveProperty('mode', 'production');

    // adds the CleanWebpackPlugin
    expect(config).toHaveProperty('plugins');
    expect(config.plugins).toHaveLength(5);

    expect(MiniCssExtractPlugin).toBeCalledWith({
      chunkFilename: '[name]-[chunkhash].css',
      filename: '[name]-[chunkhash].css',
      ignoreOrder: true,
    });
    expect(PostCSSAssetsPlugin).toBeCalled();

    const definePluginOptions = expect.objectContaining({
      CERNER_BUILD_TIMESTAMP: JSON.stringify(new Date(mockDate).toISOString()),
      TERRA_AGGREGATED_LOCALES: undefined,
      TERRA_THEME_CONFIG: JSON.stringify({}),
    });
    expect(DefinePlugin).toBeCalledWith(definePluginOptions);

    const cleanPluginOptions = expect.objectContaining({ cleanOnceBeforeBuildPatterns: expect.arrayContaining(['!stats.json']) });

    expect(CleanWebpackPlugin).toBeCalledWith(cleanPluginOptions);

    // removes devtool option
    expect(config).toHaveProperty('devtool', false);

    // replace the output with prod config
    const expectedOuput = {
      filename: '[name]-[chunkhash].js',
      chunkFilename: '[name]-[chunkhash].js',
    };
    expect(config.output).toEqual(expect.objectContaining(expectedOuput));

    // optimizes production assets
    expect(config.optimization).toHaveProperty('minimizer');
    expect(config.optimization.minimizer).toHaveLength(1);
    expect(TerserPlugin).toBeCalled();
  });

  it('accepts disableAggregateTranslations env variable', () => {
    const disableAggregateTranslations = true;
    const config = webpackConfig({ disableAggregateTranslations }, {});

    // and it does not aggregate translations
    expect(aggregateTranslations).not.toBeCalled();

    // and it does not add aggregated-translations to resolve modules
    const expectedModules = expect.arrayContaining([
      expect.stringContaining('aggregated-translations'),
    ]);

    expect(config.resolve.modules).toHaveLength(1);
    expect(config.resolveLoader.modules).not.toEqual(expectedModules);

    // should add the TERRA_AGGREGATED_LOCALES global as undefined if locale aggregation is disabled
    const expected = {
      CERNER_BUILD_TIMESTAMP: JSON.stringify(new Date(mockDate).toISOString()),
      TERRA_AGGREGATED_LOCALES: undefined,
      TERRA_THEME_CONFIG: JSON.stringify({}),
    };
    expect(DefinePlugin).toBeCalledWith(expected);
  });

  it('accepts disableHotReloading env variable', () => {
    const disableHotReloading = true;
    const config = webpackConfig({ disableHotReloading }, {});

    //  and adds to dev server options', () => {
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

  it('sets TERRA_THEME_CONFIG to the defined theme', () => {
    getThemeConfig.mockImplementation(() => ({
      theme: 'test-theme',
    }));

    webpackConfig({}, {});

    const expected = {
      CERNER_BUILD_TIMESTAMP: JSON.stringify(new Date(mockDate).toISOString()),
      TERRA_AGGREGATED_LOCALES: undefined,
      TERRA_THEME_CONFIG: JSON.stringify({
        theme: 'test-theme',
      }),
    };
    expect(DefinePlugin).toBeCalledWith(expected);
  });

  it('overrides theme config', () => {
    getThemeConfig.mockImplementation(() => ({
      theme: 'test-theme',
    }));

    webpackConfig({}, {}, { themeConfig: { theme: 'override-theme' } });

    const expected = {
      CERNER_BUILD_TIMESTAMP: JSON.stringify(new Date(mockDate).toISOString()),
      TERRA_AGGREGATED_LOCALES: undefined,
      TERRA_THEME_CONFIG: JSON.stringify({
        theme: 'override-theme',
      }),
    };
    expect(DefinePlugin).toBeCalledWith(expected);
  });
});
