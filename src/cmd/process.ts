import log from '../lib/logger';
import { searchArr, getDate, noExt } from '../lib/util';
import fs from 'fs';
import path from 'path';
import { CommandObject, File } from '../lib/interfaces';

export default async function processImages(cmdObj: CommandObject): Promise<void> {
  // Organizes images into dirs named by date and subdirs named by filetype
  const cwd = process.cwd();
  let rawFiletype = cmdObj.rawfile as string;
  const noSync = () => cmdObj.nosync ? '.nosync' : '';
  const rawNames: File[] = [];
  const jpgNames: File[] = [];

  // Prepend '.' to rawFiletype
  rawFiletype = rawFiletype[0] !== '.' ? '.' + rawFiletype : rawFiletype;

  // Collect all images into arrays
  fs.readdir(cwd, function (err, files) {
    if (err) {
      log.err(`Could not read directory: ${err.message}`);
    }

    files.forEach(function (file) {
      const ext = path.extname(file);
      if (ext === rawFiletype) {
        rawNames.push({ name: file, created: fs.statSync(file).birthtime });
      } else if (ext === '.JPG' || ext === '.JPEG') {
        jpgNames.push({ name: file, created: fs.statSync(file).birthtime });
      }
    });

    if (rawNames.length === 0 || jpgNames.length === 0) {
      log.err(`Found ${rawNames.length} RAW, ${jpgNames.length} JPG files in current directory.`);
    } else {
      log.info(`Found ${rawNames.length} RAW, ${jpgNames.length} JPG in current directory`);
    }

    // Verify pairings
    rawNames.forEach(file => {
      const filename = noExt(file.name);
      if (!searchArr(`${filename}.JPG`, jpgNames)) {
        log.warn(`File ${file.name} has no counterpart.`);
      }
    });

    jpgNames.forEach(file => {
      const filename = noExt(file.name);
      if (!searchArr(`${filename}${rawFiletype}`, rawNames)) {
        log.warn(`File ${file.name} has no counterpart.`);
      }
    });

    // Collect file creation dates
    const imageCal: string[] = [];

    rawNames.forEach(file => {
      if (!imageCal.includes(getDate(file.created))) {
        imageCal.push(getDate(file.created));
      }
    });

    // Create folders and move files
    imageCal.forEach(element => {
      if (!fs.existsSync(element)) {
        fs.mkdirSync(`${element}${noSync()}/RAW`, { recursive: true });
        fs.mkdirSync(`${element}${noSync()}/JPG`, { recursive: true });
      } else {
        log.err(`Directory ${element} already exists.`);
      }
    });

    log.info(`Created folders ${imageCal}`);
    rawNames.forEach(file => {
      fs.rename(file.name, `${getDate(file.created)}${noSync()}/RAW/${file.name}`, (err: Error | null) => {
        if (err) log.warn(`Could not move file ${file.name}: ${err?.message}`);
      });
    });

    jpgNames.forEach(file => {
      fs.rename(file.name, `${getDate(file.created)}${noSync()}/JPG/${file.name}`, (err: Error | null) => {
        if (err) log.warn(`Could not move file ${file.name}: ${err?.message}`);
      });
    });

    log.info(`\n${rawNames.length + jpgNames.length} images processed successfully.`);
  });
}