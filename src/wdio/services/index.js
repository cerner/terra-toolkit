import AxeService from './AxeService';
import TerraService from './TerraService';
import SeleniumDockerService from './SeleniumDockerService';
import ExpressDevServerService from './ExpressDevServerService';

module.exports.Axe = new AxeService();
module.exports.Terra = new TerraService();
module.exports.SeleniumDocker = new SeleniumDockerService();
module.exports.ExpressDevService = new ExpressDevServerService();
