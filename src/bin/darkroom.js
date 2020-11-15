const nodeProcess = require('process');
const log = require('./logger');
const util = require('./util');
const fs = require('fs');
const path = require('path');

async function process(rawFiletype) {
  // Organizes images into dirs named by date and subdirs named by filetype
  const cwd = nodeProcess.cwd();
  let rawNames = [];
  let jpgNames = [];

  // Assume .ARW if not specified
  if (!rawFiletype) {
    rawFiletype = '.ARW';
  } else {
    rawFiletype = '.' + rawFiletype;
  }

  // Collect all images into arrays
  fs.readdir(cwd, function (err, files) {
    if (err) {
      log.err('Unable to scan directory: ' + err);
    }

    files.forEach(function (file) {
      const ext = path.extname(file);
      if (ext === rawFiletype) {
        rawNames.push({ name: file, created: fs.statSync(file).birthtimeMs });
      } else if (ext === '.JPG') {
        jpgNames.push({ name: file, created: fs.statSync(file).birthtimeMs });
      }
    });

    if (rawNames.length === 0 || jpgNames.length === 0) {
      log.err('No RAW or JPG files in current directory');
    } else {
      log.info(`Found ${rawNames.length} RAW, ${jpgNames.length} JPG in current directory`);
    }

    // Verify pairings
    rawNames.forEach(file => {
      const filename = util.noExt(file.name);
      if (!util.searchArr(`${filename}.JPG`, jpgNames)) {
        log.warn(`File ${file.name} has no counterpart.`);
      }
    });

    jpgNames.forEach(file => {
      const filename = util.noExt(file.name);
      if (!util.searchArr(`${filename}${rawFiletype}`, rawNames)) {
        log.warn(`File ${file.name} has no counterpart.`);
      }
    });

    // Collect file creation dates
    let imageCal = [];

    rawNames.forEach(file => {
      if (!imageCal.includes(util.getDate(file.created))) {
        imageCal.push(util.getDate(file.created));
      }
    });

    // Create folders and move files
    imageCal.forEach(element => {
      if (!fs.existsSync(element)) {
        fs.mkdirSync(`${element}/RAW`, { recursive: true });
        fs.mkdirSync(`${element}/JPG`, { recursive: true });
      } else {
        log.err(`Directory ${element} already exists.`);
      }
    });

    log.info(`Created folders ${imageCal}`);
    rawNames.forEach(file => {
      fs.renameSync(file.name, `${util.getDate(file.created)}/RAW/${file.name}`, (err) => {
        log.err(`Could not move file ${file.name}: ${err}`);
      });
    });

    jpgNames.forEach(file => {
      fs.renameSync(file.name, `${util.getDate(file.created)}/JPG/${file.name}`, (err) => {
        log.err(`Could not move file ${file.name}: ${err}`);
      });
    });

    log.info(`\n${rawNames.length + jpgNames.length} images processed successfully.`);
  });
}

function prune(directory) {
  log.info(`Pruning ${directory}`);
}

module.exports = { process, prune };