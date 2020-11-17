/* eslint-disable no-magic-numbers */

import * as manifest from '../../package.json';
import chalk from 'chalk';
import updateCheckTool from 'update-check';
import logger from './logger';
import open from 'open';
import { File } from './interfaces';

export function cliHeader(): void {
  console.log(`${chalk.gray(manifest.productName + ' ' + manifest.version)}\n`);
}

export async function updateCheck(): Promise<void> {
  const update = await updateCheckTool(manifest);

  if (update) {
    console.log(`${chalk.bgRed('UPDATE AVAILABLE')} Run '${chalk.cyan(`npm i -g ${manifest.name}@latest`)}' to install.\n`);
  }
}

export function reportIssue(): void {
  logger.info(`Opening ${manifest.bugs.url}/new in your web browser...`);
  open(manifest.bugs.url + '/new');
}

export function noExt(filename:string): string {
  // Returns filename without extension attached
  return filename.split('.')[0];
}

export function searchArr(key: string, array: File[]): boolean {
  for (let i = 0; i < array.length; i++) {
    if (array[i].name === key) {
      return true;
    }
  }

  return false;
}

export function getDate(timestamp: Date): string {
  // Converts timestamp to format YYYY-MM-DD
  const date = new Date(timestamp);
  const dateString:string = date.getFullYear().toString()
    + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1))
    + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
  return dateString;
}