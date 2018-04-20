# FAQ
## I'm trying to run tt:server or tt:serve-static and I get this Error `Error: Cannot find module 'webpack'`
What's happening here is that you have a dependency that is pulling in a conflicting version of webpack and the webpack module is not being included in the root level of node modules.
There are two fixes for this problem:
1. You can find the confilicting module and remove or update it. A good way to trouble shoot this is to generate a package-lock.json and search for the "webpack" module.
2. You can include the version of webpack that you need directly in your package.json. We prefer the first solution to allow us to upgrade webpack more easily in the future, but both will fix the issue.
