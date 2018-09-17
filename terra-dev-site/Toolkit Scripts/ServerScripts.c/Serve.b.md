## serve
Serve is a replacement for webpack-dev-server. Behind the scenes it's using [webpack-serve](https://github.com/webpack-contrib/webpack-serve).
Serve is a hot reloading server and does not work on IE 10 or below. See [compatible browsers](https://caniuse.com/#feat=websockets). Use serve-static for IE 10 testing.

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
| **host** | false | `undefined` | Sets the host that the server will listen on. eg. '10.10.10.1' |

#### In code
```javascript
const serve = require('terra-toolkit/scripts/serve/serve');
const webpackConfig = require(./webpack.config);

serve({ config: webpackConfig });
```
