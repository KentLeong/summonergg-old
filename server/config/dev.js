const config = require('../../config');
const chalk = require('chalk');

var out = function(message, status) {
  var colorized;
  if (config.dev) {
    switch (status) {
      case "success":
          colorized = chalk.green.underline("[ SUCCESS ]");
          message = chalk.green(message);
          break;
      case "info":
          colorized = chalk.blue.underline("[ INFO    ]");
          message = chalk.blue(message);
          break;
      case "error":
          colorized = chalk.red.underline("[ ERROR   ]");
          message = chalk.red(message);
          break;
      case "warning":
          colorized = chalk.yellow.underline("[ WARNING ]");
          message = chalk.yellow(message);
          break;
      case "complete":
          colorized = chalk.magenta.underline("[ COMPLETE ]");
          message = chalk.magenta(message);
          break;
      default:
          colorized = chalk.white(message);
    }
    console.log(colorized+" "+message)
  }
}
module.exports = out