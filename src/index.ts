#!/usr/bin/env node

import manifest from './manifest';
import { reportIssue, cliHeader, updateCheck } from './lib/util';
import processImages from './cmd/process';
import pruneImages from './cmd/prune';
import { program } from 'commander';
import { CommandObject } from './lib/interfaces';

program.version(manifest.version);

program
  .command('process')
  .description('organizes photos within current dir by date')
  .option('-r, --rawfile <type>', 'specify RAW file extension', 'ARW')
  .option('-e, --exclude', 'exclude folders from iCloud Drive (macOS only)', false)
  .action((cmdObj: CommandObject) => processImages(cmdObj));

program
  .command('prune [directory]')
  .description('delete RAW files that do not have a matching JPG')
  .option('-r, --rawfile <type>', 'specify RAW file extension', 'ARW')
  .action((directory: string, cmdObj: CommandObject) => pruneImages(directory, cmdObj.rawfile as string));

program
  .command('report')
  .description('create a new issue on GitHub')
  .action(() => reportIssue());

const main = async () => {
  if (!process.argv.includes('-V') && !process.argv.includes('--version')) {
    cliHeader();
  }

  await updateCheck();
  program.parse(process.argv);
};

main();