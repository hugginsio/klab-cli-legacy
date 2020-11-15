const package = require('../../package.json');
const chalk = require('chalk');
const log = require('./logger');
const updateCheckTool = require('update-check');
const open = require('open');

function cliHeader() {
  console.log(`${chalk.gray(package.productName + ' ' + package.version)}\n`);
}

async function updateCheck() {
  const update = await updateCheckTool(package);

  if (update) {
    console.log(`${chalk.bgRed('UPDATE AVAILABLE')} Run '${chalk.cyan(`npm i -g ${package.name}@latest`)}' to install.\n`);
  }
}

function reportIssue() {
  log.info(`Opening ${package.bugs.url}/new in your web browser...`);
  open(package.bugs.url + '/new');
}

function noExt(filename) {
  // Returns filename without extension attached
  return filename.split('.')[0];
}

function searchArr(key, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i]['name'] === key) {
      return true;
    }
  }

  return false;
}

function getDate(timestamp) {
  // Converts timestamp to format YYYY-MM-DD
  const date = new Date(timestamp);
  let dateString = date.getFullYear();
  dateString += '-';
  dateString += date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  dateString += '-';
  dateString += date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return dateString;
}

module.exports = { cliHeader, updateCheck, reportIssue, noExt, searchArr, getDate };