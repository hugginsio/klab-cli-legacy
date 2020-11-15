const chalk = require('chalk');
const process = require('process');

function br() {
  console.log('');
}

function info(msg) {
  console.log(chalk.white(msg));
}

function warn(msg) {
  console.log(`${chalk.yellow('Warning!')} ${chalk.white(msg)}`);
}

function err(msg) {
  console.log(`${chalk.red('Error!')} ${chalk.white(msg)}`);
  process.exit(4);
}

module.exports = { br, info, warn, err };