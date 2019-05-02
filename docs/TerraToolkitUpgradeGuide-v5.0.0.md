# Terra Toolkit Upgrade Guide v5.0.0
This document will provide information on upgrading from terra-toolkit 4.x to 5.0.0.

## WebdriverIO
The defualt form factor is now 'huge' to correct inconsistent viewport sizing that had occured when a test used the default viewport for a test run vs defining a huge viewport. This may require screenshot updates, but no code changes are necessary.