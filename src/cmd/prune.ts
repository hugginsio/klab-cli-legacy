import log from '../lib/logger';
import { noExt } from '../lib/util';
import fs from 'fs';
import path from 'path';

export default function pruneImages(directory: string, rawFiletype: string): void {
  const cwd = (directory ? directory : process.cwd()) + '/';

  // Prepend '.' to rawFiletype
  rawFiletype = rawFiletype[0] !== '.' ? '.' + rawFiletype : rawFiletype;

  // Check if required subdirs exist
  if (!fs.existsSync(cwd + 'RAW')) {
    log.err('RAW directory does not exist.');
  }

  if (!fs.existsSync(cwd + 'JPG')) {
    log.err('JPG directory does not exist.');
  }

  // Build list of JPGs
  const jpgNames: string[] = [];
  const rawNames: string[] = [];

  fs.readdir(cwd + 'JPG', (err, files) => {
    if (err) {
      log.err(`Could not read directory: ${err.message}`);
    }

    files.forEach((file) => {
      const ext = path.extname(file);
      if (ext === '.JPG' || ext === '.JPEG') {
        jpgNames.push(file);
      }
    });

    fs.readdir(cwd + 'RAW', (err, files) => {
      if (err) {
        log.err(`Could not read directory: ${err.message}`);
      }

      files.forEach((file) => {
        const ext = path.extname(file);
        if (ext === rawFiletype) {
          rawNames.push(file);
        }
      });

      // Delete RAW files that don't have a JPEG counterpart
      rawNames.forEach(file => {
        const filename = noExt(file);
        if (!jpgNames.includes(`${filename}.JPG`)) {
          fs.unlink(cwd + 'RAW/' + file, err => {
            if (err) {
              log.err(`Could not delete ${file}: ${err.message}`);
            }
          });
        }
      });

      log.info(`Deleted ${rawNames.length - jpgNames.length} RAW file(s).`);
    });
  });
}