#!/usr/bin/env node

import manifest from '../package.json';
import { reportIssue, cliHeader, updateCheck } from './lib/util';
import { processImages, pruneDirectory } from './lib/darkroom';
import { program } from 'commander';
import { CommandObject } from './lib/interfaces';

program.version(manifest.version);

program
  .command('process')
  .description('organizes photos within current dir by date')
  .option('-rf, --rawfile <type>', 'specify RAW file extension', 'ARW')
  .option('-ns, --nosync', 'exclude folders from iCloud Drive (macOS only)', false)
  .action((cmdObj: CommandObject) => processImages(cmdObj));

program
  .command('prune [directory]')
  .description('delete RAW files that do not have a matching JPG')
  .option('-rf, --rawfile <type>', 'specify RAW file extension', 'ARW')
  .action((directory: string, cmdObj: CommandObject) => pruneDirectory(directory, cmdObj.rawfile as string));

program
  .command('report')
  .description('create a new issue on GitHub')
  .action(() => reportIssue());

const main = async () => {
  cliHeader();
  updateCheck();
  program.parse(process.argv);
};

main();