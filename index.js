/*
 The postinstall script is run both when installing packages in the monorepo via `npm install`
and when the monorepo package is installed into other projects, like the theme repo.

The isInstalled variable allows us to detect between to these 2 cases.

When `npm install` is run within monorepo, process.cwd() does not include `node_modules`
example: process.cwd() outputs the follow:
/Users/computerName/repos/terra-core

When the monorepo is installed in the theme repo, process.cwd() does include `node_modules`
example: process.cwd() outputs the follow:
/Users/computerName/repos/cerner-consumer-theme/node_modules/terra-core

*/

console.log(process)