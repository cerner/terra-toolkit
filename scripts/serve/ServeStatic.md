# Terra Toolkit Serve-Static
Serve static is a non-hot reloading server that uses express behind the scenes. The serve static method can take a pre-compiled site folder. This server can be used in `ServeStaticService` to serve sites for wdio visual regression testing.

Serve-static is offered up as both a cli and a javascript function.

### CLI
#### API
| Name  | Required | Default Value | Description |
| ------------- | ------------- | ------------- | ------------- |
| **--port**  | false | `8080` | The port the server should listen on. |
| **--site** | true | `undefined` | The relative path to the static site. This takes precedence over webpack config if both are passed.|
| **--host** | false | `0.0.0.0` | Sets the host that the server will listen on. eg. '10.10.10.1' |

#### In your package.json
```JSON
{
  "start-static": "tt-serve-static --site './build'"
}
```
### Function
#### API
| Name  | Required | Default Value | Description |
| ------------- | ------------- | ------------- | ------------- |
| **port**  | false | `8080` | The port the server should listen on. |
| **site** | required | `undefined` | The relative path to the static site. This takes precedence over webpack config if both are passed.|
| **index** | false | `index.html` | The entry point for your site. Only used when webpack config is passed|
| **host** | false | `0.0.0.0` | Sets the host that the server will listen on. eg. '10.10.10.1' |

#### In code
```javascript
const serveStatic = require('terra-toolkit/scripts/serve/serve-static');
const webpackConfig = require(./webpack.config);

serveStatic({ site: './build' });
```
