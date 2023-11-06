const fs = require('fs');
const prettifyJSON = require('../prettifyJSON/prettifyJSON');

let fsReadFileMock;

describe.only('prettifyJSON script', () => {
  beforeAll(() => {
    fsReadFileMock = jest.spyOn(fs, 'readFileSync');

    jest.spyOn(fs, 'writeFileSync').mockImplementation();
    jest.spyOn(fs, 'appendFileSync').mockImplementation();
  });
  afterAll(() => {
    jest.mockRestore();
  });

  it('orders the input JSON keys', () => {
    fsReadFileMock.mockReturnValueOnce(
      {
        publishConfig: {},
        peerDependencies: {},
        browserslist: {},
        description: {},
        repository: {},
        bugs: {},
        engines: {},
        scripts: {},
        main: {},
        dependencies: {},
        author: {},
        license: {},
        workspaces: [],
        name: {},
        version: {},
        stylelint: {},
        files: [],
        'package-json-lint': {},
        bin: {},
        devDependencies: {},
        homepage: {},
        private: {},
        keywords: [],
        eslintConfig: {},
      },
    );

    const JSON = fs.readFileSync();
    const newJSON = prettifyJSON(JSON);
    const keys = Object.keys((newJSON));
    const expectedArray = [
      'name',
      'version',
      'description',
      'author',
      'repository',
      'bugs',
      'homepage',
      'license',
      'keywords',
      'private',
      'publishConfig',
      'workspaces',
      'engines',
      'main',
      'files',
      'bin',
      'browserslist',
      'eslintConfig',
      'package-json-lint',
      'stylelint',
      'dependencies',
      'peerDependencies',
      'devDependencies',
      'scripts',
    ];

    expect(keys).toStrictEqual(expectedArray);
    expect(keys).not.toStrictEqual(['name', 'devDependencies', 'description']);
  });

  it('puts dependencies, devDependencies, peerDependencies & scripts at the end', () => {
    fsReadFileMock.mockReturnValueOnce(
      {
        name: {},
        keyA: {},
        otherKey: {},
        key6: {},
        peerDependencies: {},
        key1: {},
        devDependencies: {},
        key2: {},
        key3: {},
        scripts: {},
        key4: {},
        dependencies: {},
        key5: {},
      },
    );

    const JSON = fs.readFileSync();
    const newJSON = prettifyJSON(JSON);
    const keys = Object.keys((newJSON));

    expect(keys.slice(-4)).toStrictEqual(['dependencies', 'peerDependencies', 'devDependencies', 'scripts']);
    expect(keys.slice(-4)).not.toStrictEqual(['devDependencies', 'scripts', 'peerDependencies', 'dependencies']);
  });

  it('adds other keys before dependencies', () => {
    fsReadFileMock.mockReturnValueOnce(
      {
        description: {},
        otherKey: {},
        devDependencies: {},
        name: 'test',
      },
    );

    const JSON = fs.readFileSync();
    const newJSON = prettifyJSON(JSON);
    const keys = Object.keys((newJSON));

    expect(keys).toStrictEqual(['name', 'description', 'otherKey', 'devDependencies']);
  });

  it('alphabetizes keywords', () => {
    fsReadFileMock.mockReturnValueOnce({ keywords: ['JJJ', 'ZZZ', 'III', 'AAA', 'CCC'] });

    const JSON = fs.readFileSync();
    const newJSON = prettifyJSON(JSON);

    expect(newJSON.keywords).toStrictEqual(['AAA', 'CCC', 'III', 'JJJ', 'ZZZ']);
  });

  it('alphabetizes files', () => {
    fsReadFileMock.mockReturnValueOnce({ files: ['JJJ', 'ZZZ', 'III', 'AAA', 'CCC'] });

    const JSON = fs.readFileSync();
    const newJSON = prettifyJSON(JSON);

    expect(newJSON.files).toStrictEqual(['AAA', 'CCC', 'III', 'JJJ', 'ZZZ']);
  });

  it('alphabetizes workspaces', () => {
    fsReadFileMock.mockReturnValueOnce({ workspaces: ['JJJ', 'ZZZ', 'III', 'AAA', 'CCC'] });

    const JSON = fs.readFileSync();
    const newJSON = prettifyJSON(JSON);

    expect(newJSON.workspaces).toStrictEqual(['AAA', 'CCC', 'III', 'JJJ', 'ZZZ']);
  });

  it('alphabetizes remaining keys', () => {
    fsReadFileMock.mockReturnValueOnce(
      {
        key6: {},
        key4: {},
        key2: {},
        otherKey: {},
        key5: {},
        key3: {},
        key1: {},
        keyA: {},
      },
    );

    const JSON = fs.readFileSync();
    const newJSON = prettifyJSON(JSON);
    const keys = Object.keys((newJSON));

    expect(keys).toStrictEqual([
      'key1',
      'key2',
      'key3',
      'key4',
      'key5',
      'key6',
      'keyA',
      'otherKey',
    ]);
  });
});
