#!/usr/bin/env node

const packageVersion = require('../package.json').version;
const util = require('./bin/util');
const darkroom = require('./bin/darkroom');
const { program } = require('commander');

program.version(packageVersion);

program
  .command('process [rawFiletype]')
  .description('organizes photos within current dir by date')
  .action((rawFiletype) => darkroom.process(rawFiletype));

program
  .command('prune <directory>')
  .description('delete RAW files that do not have a matching JPG')
  .action((jpgDir, rawDir) => darkroom.prune(jpgDir, rawDir));

  program
  .command('report')
  .description('create a new issue on GitHub')
    .action(() => util.reportIssue());

const main = async () => {
  util.cliHeader();
  util.updateCheck();
  program.parse(process.argv);
}

main();