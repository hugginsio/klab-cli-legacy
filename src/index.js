#!/usr/bin/env node

const packageVersion = require('../package.json').version;
const util = require('./bin/util');
const darkroom = require('./bin/darkroom');
const { program } = require('commander');
const process = require('process');

program.version(packageVersion);

program
  .command('process')
  .description('organizes photos within current dir by date')
  .option('-rf, --rawfile <type>', 'specify RAW filetype', 'ARW')
  .option('-ns, --nosync', 'exclude folders from iCloud Drive (macOS only)', false)
  .action((cmdObj) => darkroom.process(cmdObj));

program
  .command('prune [directory]')
  .description('delete RAW files that do not have a matching JPG')
  .option('-rf, --rawfile <type>', 'specify RAW filetype', 'ARW')
  .action((directory, cmdObj) => darkroom.prune(cmdObj.rawfile, directory));

program
  .command('report')
  .description('create a new issue on GitHub')
  .action(() => util.reportIssue());

const main = async () => {
  util.cliHeader();
  util.updateCheck();
  program.parse(process.argv);
};

main();