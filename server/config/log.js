const config = require('../../config');
const chalk = require('chalk');
var log = function(message, status) {
  var colorized;
  if (config.dev) {
    switch (status) {
      case "success":
          colorized = chalk.green("[ SUCCESS ] " + message);
          break;
      case "info":
          colorized = chalk.blue("[ INFO    ] "+message);
          break;
      case "error":
          colorized = chalk.red("[ ERROR   ] "+message);
          break;
      case "warning":
          colorized = chalk.yellow("[ WARNING ] "+message);
          break;
      default:
          colorized = chalk.white(message);
    }
    console.log(colorized)
  }
}
module.exports = log;