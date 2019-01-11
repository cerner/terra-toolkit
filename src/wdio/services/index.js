import AxeService from './AxeService';
import TerraService from './TerraService';
import SeleniumDockerService from './SeleniumDockerService';
import ServeStaticService from './ServeStaticService';
import TerraVisualRegressionService from './TerraVisualRegressionService';

module.exports.Axe = new AxeService();
module.exports.Terra = new TerraService();
module.exports.SeleniumDocker = new SeleniumDockerService();
module.exports.ServeStaticService = new ServeStaticService();
module.exports.TerraVisualRegressionService = new TerraVisualRegressionService();
