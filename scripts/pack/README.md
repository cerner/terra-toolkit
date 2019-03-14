# Terra Toolkit Pack

Terra Toolkit offers a way to pack individual packages into a tar archive file.

## Description
`tt-pack` utilizes [npm pack](https://docs.npmjs.com/cli/pack) to create a tarball from a package.

The tar archive file will be written to the current working directory in the following format: `<package-name>.tgz`. Assets should be compiled before packing. Everything except the items declared in the npmignore will be included within the tar archive file.

If there is an existing tar file it will be overwritten.

## Usage
### In your package.json
```JSON
{
  "scripts": {
    "tt-pack": "tt-pack"
  }
}
```
### Running the command
```
npm run tt-pack
```
### Output
package-name.tgz

### Additional details
The tar archive file can be referenced as a dependency for local development, but should not be released as one.

#### Git
```JSON
{
  "dependencies": {
    "package-name": "https://raw.githubusercontent.com/org/project/blob/package-name.tgz"
  }
}
```
#### File
```JSON
{
  "dependencies": {
    "package-name": "file:../package-name.tgz"
  }
}
```
