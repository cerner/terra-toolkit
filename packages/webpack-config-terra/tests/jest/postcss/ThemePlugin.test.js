const ThemePlugin = require('../../../lib/postcss/ThemePlugin');

describe('Theme Plugin', () => {
  it('clones the default theme to root', () => {
    const config = {
      theme: 'terra-mock-dark-theme',
    };
    const mockNode = {
      selector: '.terra-mock-dark-theme',
      clone: jest.fn().mockReturnValueOnce('clone'),
      parent: {
        removeChild: jest.fn(),
      },
    };

    const mockRoot = {
      walkRules: jest
        .fn()
        .mockImplementation((func) => func(mockNode)),
      append: jest.fn(),
    };

    const instance = ThemePlugin(config);

    instance(mockRoot);

    expect(mockRoot.walkRules).toHaveBeenCalledTimes(1);
    expect(mockNode.clone).toHaveBeenCalledTimes(1);
    expect(mockRoot.append).toHaveBeenCalledWith('clone');
    expect(mockNode.parent.removeChild).not.toHaveBeenCalled();
  });

  it('removes unlisted supported themes', () => {
    const config = {
    };
    const mockNode = {
      selector: '.orion-fusion-theme',
      clone: jest.fn().mockReturnValueOnce('clone'),
      parent: {
        removeChild: jest.fn(),
      },
    };

    const mockRoot = {
      walkRules: jest
        .fn()
        .mockImplementation((func) => func(mockNode)),
      append: jest.fn(),
    };

    const instance = ThemePlugin(config);

    instance(mockRoot);

    expect(mockRoot.walkRules).toHaveBeenCalledTimes(1);
    expect(mockNode.clone).not.toHaveBeenCalled();
    expect(mockRoot.append).not.toHaveBeenCalled();
    expect(mockNode.parent.removeChild).toHaveBeenCalledTimes(1);
  });

  it('does not remove listed selectors', () => {
    const config = {
      scoped: [
        'orion-fusion-theme',
      ],
    };
    const mockNode = {
      selector: '.orion-fusion-theme',
      clone: jest.fn().mockReturnValueOnce('clone'),
      parent: {
        removeChild: jest.fn(),
      },
    };

    const mockRoot = {
      walkRules: jest
        .fn()
        .mockImplementation((func) => func(mockNode)),
      append: jest.fn(),
    };

    const instance = ThemePlugin(config);

    instance(mockRoot);

    expect(mockRoot.walkRules).toHaveBeenCalledTimes(1);
    expect(mockNode.clone).not.toHaveBeenCalled();
    expect(mockRoot.append).not.toHaveBeenCalled();
    expect(mockNode.parent.removeChild).not.toHaveBeenCalled();
  });

  it('does nothing if no selectors match', () => {
    const config = {
      scoped: [
        'orion-fusion-theme',
        'clinical-lowlight-theme',
        'cerner-clinical-theme',
      ],
    };
    const mockNode = {
      selector: '.derp',
      clone: jest.fn().mockReturnValueOnce('clone'),
      parent: {
        removeChild: jest.fn(),
      },
    };

    const mockRoot = {
      walkRules: jest
        .fn()
        .mockImplementation((func) => func(mockNode)),
      append: jest.fn(),
    };

    const instance = ThemePlugin(config);

    instance(mockRoot);

    expect(mockRoot.walkRules).toHaveBeenCalledTimes(1);
    expect(mockNode.clone).not.toHaveBeenCalled();
    expect(mockRoot.append).not.toHaveBeenCalled();
    expect(mockNode.parent.removeChild).not.toHaveBeenCalled();
  });
});
