import TerraService from './wdio-terra-service';
import SeleniumDockerService from './wdio-selenium-docker-service';
import AssetServeService from './wdio-asset-server-service';

module.exports.Terra = new TerraService();
module.exports.SeleniumDocker = new SeleniumDockerService();
module.exports.AssetServeService = new AssetServeService();
