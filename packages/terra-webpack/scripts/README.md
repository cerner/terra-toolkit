# Terra Toolkit Serve

Terra Toolkit offers up two different commands to serve your client side application, `serve` and `serve-static`.
If you are using terra-dev-site, use the provided `tt-serve`/`tt-serve-static` commands instead.

## serve
Serve is an abstraction for [webpack-dev-server](https://github.com/webpack/webpack-dev-server).
Serve is a hot reloading server and may not work on IE 10 or below. See [browser support](https://github.com/webpack/webpack-dev-server#browser-support). Use serve-static for IE 10 testing.

Serve is offered up as both a cli and a javascript function.

### CLI
#### API
| Name  | Required | Default Value | Description |
| ------------- | ------------- | ------------- | ------------- |
| **--config**  | false | `undefined` | The webpack config to serve. |
| **--port**  | false | `8080` | The port the server should listen on. |
| **-p, --production** | false | false | Passes the -p flag to the webpack config. |
| **--host** | false | `0.0.0.0` | Sets the host that the server will listen on. eg. '10.10.10.1' |

If no config is supplied tt-serve will first search for `webpack.config.js` in the working directory. If that is not found it will attempt to use the default webpack config supplied by terra-dev-site.

#### In your package.json
```JSON
{
  "start": "tt-serve --config src/webpack/webpack.config"
}
```
### Function
#### API
| Name  | Required | Default Value | Description |
| ------------- | ------------- | ------------- | ------------- |
| **config**  | true | `undefined` | The webpack config to serve. |
| **port**  | false | `8080` | The port the server should listen on. |
| **production** | false | false | Passes the -p flag to the webpack config. |
| **host** | false | `0.0.0.0` | Sets the host that the server will listen on. eg. '10.10.10.1' |

#### In code
```javascript
const serve = require('terra-toolkit/scripts/serve/serve');
const webpackConfig = require(./webpack.config);

serve({ config: webpackConfig });
```

## serve-static
Serve static is a non-hot reloading server that uses express behind the scenes. The serve static method can either take a pre-compiled site folder or a webpack config to compile a site for you. It also offers a virtual file system to avoid saving files to disk. This server is also used in `ServeStaticService` to serve sites for wdio visual regression testing.

Serve-static is offered up as both a cli and a javascript function.

### CLI
#### API
| Name  | Required | Default Value | Description |
| ------------- | ------------- | ------------- | ------------- |
| **--config**  | false | `undefined` | The webpack config to serve. |
| **--port**  | false | `8080` | The port the server should listen on. |
| **-p, --production** | false | false | Passes the -p flag to the webpack config. |
| **--site** | false | `undefined` | The relative path to the static site. This takes precedence over webpack config if both are passed.|
| **--disk** | false | `false` | The webpack assets will be written to disk instead of a virtual file system. Only used when webpack config is passed |
| **--host** | false | `0.0.0.0` | Sets the host that the server will listen on. eg. '10.10.10.1' |

If no config is supplied tt-serve-static will first search for `webpack.config.js` in the working directory. If that is not found it will attempt to use the default webpack config supplied by terra-dev-site.

#### In your package.json
```JSON
{
  "start-static": "tt-serve-static --config src/webpack/webpack.config --vfs",
  "start-static": "tt-serve-static --site build"
}
```
### Function
#### API
| Name  | Required | Default Value | Description |
| ------------- | ------------- | ------------- | ------------- |
| **config**  | true | `undefined` | The webpack config to serve. |
| **port**  | false | `8080` | The port the server should listen on. |
| **production** | false | false | Passes the -p flag to the webpack config. |
| **site** | false | `undefined` | The relative path to the static site. This takes precedence over webpack config if both are passed.|
| **disk** | false | `false` | The webpack assets will be written to disk instead of a virtual file system. Only used when webpack config is passed |
| **index** | false | `index.html` | The entry point for your site. Only used when webpack config is passed|
| **host** | false | `undefined` | Sets the host that the server will listen on. eg. '10.10.10.1' |

#### In code
```javascript
const serveStatic = require('terra-toolkit/scripts/serve/serve-static');
const webpackConfig = require(./webpack.config);

serveStatic({ config: webpackConfig, vfs: true });
```
