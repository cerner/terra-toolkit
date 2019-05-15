# Terra Toolkit Upgrade Guide v5.0.0
This document will provide information on upgrading from terra-toolkit 4.x to 6.0.0.

## WebdriverIO

### Depenedency Changes
- `axe-core`: `^2.6.1` -> `^3.0.2`.

### AxeService
The AxeService has been removed. The accessibilitly capabilites the Axe Service provided has been move to the Terra Service because the services could not run independently. The `axe` key can still be used for configuration and the test helper and axe chai assertion can be used. Please note, the `runOnly` option has been removed from Terra.should.beAccessible test helper and axe chai method and resetScroll has been enabled.

If you use the default wdio config, no changes need to be made. If using a custom wdio configuartion, be sure to remove the AxeService from the wdio config:
```diff
const {
- Axe: AxeService,
  SeleniumDocker: SeleniumDockerService,
  ServeStaticService,
  Terra: TerraService,
} = require('terra-toolkit/libwdio/services/index');

const config = {
  ...
- services: ['visual-regression', TerraService, SeleniumDockerService, ServeStaticService, AxeService],
+ services: ['visual-regression', TerraService, SeleniumDockerService, ServeStaticService],

  axe: {
    inject: true,
  },
}
```

Documentation can now be found [here](https://github.com/cerner/terra-toolkit/blob/master/docs/Wdio_Utility.md).
