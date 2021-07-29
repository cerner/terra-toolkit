jest.mock('cosmiconfig');

const { cosmiconfig } = require('cosmiconfig');
const path = require('path');

const { getConfigForFile } = require('../../../src/config');

describe('config', () => {
  describe('getConfigForFile', () => {
    it('returns an empty object when there is no config defined for a project', async () => {
      const search = jest.fn();
      cosmiconfig.mockReturnValueOnce({ search });
      search.mockResolvedValueOnce(undefined);

      const config = await getConfigForFile({ packageJsonPath: '/x/y/z/terra-toolkit/package.json' });

      expect(config).toEqual({});

      expect(cosmiconfig).toHaveBeenCalledWith('package-json-lint');
      expect(search).toHaveBeenCalledWith('/x/y/z/terra-toolkit');
    });

    it('returns an extended config with no transitive extend', async () => {
      const search = jest.fn();
      cosmiconfig.mockReturnValueOnce({ search });
      const specifiedConfig = { extends: 'package-json-lint-config-mock', rules: { x: 1, y: 2, z: 3 } };
      search.mockResolvedValueOnce({ config: specifiedConfig, filepath: path.join(__dirname, '..', '__mocks__', '/package.json') });

      const config = await getConfigForFile({ packageJsonPath: '/x/y/z/terra-toolkit/package.json' });

      expect(config).toMatchSnapshot();

      expect(cosmiconfig).toHaveBeenCalledWith('package-json-lint');
      expect(search).toHaveBeenCalledWith('/x/y/z/terra-toolkit');
    });

    it('returns an extended config with 3 transitive extends', async () => {
      const search = jest.fn();
      cosmiconfig.mockReturnValueOnce({ search });
      const specifiedConfig = { extends: 'package-json-lint-config-mock1', rules: { override: 100 } };
      search.mockResolvedValueOnce({ config: specifiedConfig, filepath: path.join(__dirname, '..', '__mocks__', '/package.json') });

      const config = await getConfigForFile({ packageJsonPath: '/x/y/z/terra-toolkit/package.json' });

      expect(config).toMatchSnapshot();

      expect(cosmiconfig).toHaveBeenCalledWith('package-json-lint');
      expect(search).toHaveBeenCalledWith('/x/y/z/terra-toolkit');
    });

    it('returns an extended config with multiple extenions', async () => {
      const search = jest.fn();
      cosmiconfig.mockReturnValueOnce({ search });
      const specifiedConfig = {
        extends: [
          'package-json-lint-config-mock3',
          'package-json-lint-config-mock2',
          'package-json-lint-config-mock1',
          'package-json-lint-config-mock',
        ],
        rules: { override: 100 },
      };
      search.mockResolvedValueOnce({ config: specifiedConfig, filepath: path.join(__dirname, '..', '__mocks__', '/package.json') });

      const config = await getConfigForFile({ packageJsonPath: '/x/y/z/terra-toolkit/package.json' });

      expect(config).toMatchSnapshot();

      expect(cosmiconfig).toHaveBeenCalledWith('package-json-lint');
      expect(search).toHaveBeenCalledWith('/x/y/z/terra-toolkit');
    });

    it('returns an extended config with multiple extenions and no override', async () => {
      const search = jest.fn();
      cosmiconfig.mockReturnValueOnce({ search });
      const specifiedConfig = {
        extends: [
          'package-json-lint-config-mock',
          'package-json-lint-config-mock1',
          'package-json-lint-config-mock2',
          'package-json-lint-config-mock3',
        ],
      };
      search.mockResolvedValueOnce({ config: specifiedConfig, filepath: path.join(__dirname, '..', '__mocks__', '/package.json') });

      const config = await getConfigForFile({ packageJsonPath: '/x/y/z/terra-toolkit/package.json' });

      expect(config).toMatchSnapshot();

      expect(cosmiconfig).toHaveBeenCalledWith('package-json-lint');
      expect(search).toHaveBeenCalledWith('/x/y/z/terra-toolkit');
    });
  });
});
