# Terra Toolkit Serve
Serve is a light abstraction for [webpack-dev-server](https://github.com/webpack/webpack-dev-server).

Why use serve instead of webpack-dev-server directly? Having the serve abstraction provides a hook for us to change the servers implementation in case webpack-dev-server no longer meets our needs.

Serve is offered up only through the CLI.

### CLI
#### API
See webpack-dev-server documentation: https://webpack.js.org/configuration/dev-server

#### In your package.json
```JSON
{
  "start": "tt-serve --config src/webpack/webpack.config"
}
```