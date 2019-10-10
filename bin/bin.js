#!/usr/bin/env node

let program = require('commander');
let fs = require('fs');
let path = require('path');
let execSync = require('child_process').execSync;
let logger = require('./logger');
let version = require('../package.json').version;

const PROCESS_CWD = process.cwd();
let batchPath;

program
  .version(version)
  .arguments('<batch>')
  .action(batch => {
    batchPath = batch;
  });

program.parse(process.argv);

if (!batchPath) {
  logger.error('ERROR: no JSON or JS file provided as an argument');
  process.exit(1);
}

let relativeBatchPath = path.resolve(PROCESS_CWD, batchPath);
let relativeBatchParentPath = relativeBatchPath.substring(
  0,
  relativeBatchPath.lastIndexOf('/')
);

let folderList;
try {
  folderList = require(relativeBatchPath);
} catch (error) {
  logger.error(`ERROR: unable to load ${relativeBatchPath}`);
  process.exit(1);
}

folderList.forEach(folder => {
  let relativeFolderPath = path.resolve(relativeBatchParentPath, folder.path);

  let folderFiles;
  try {
    folderFiles = fs
      .readdirSync(relativeFolderPath, { withFileTypes: true })
      .filter(file => !file.isDirectory())
      .map(file => file.name);
  } catch (error) {
    logger.warn(`WARNING: unable to open ${folder.path}. Skipping.`);
    return;
  }

  logger.log(`INFO: starting ${relativeFolderPath}`);

  let filteredFiles =
    typeof folder.filter === 'function'
      ? folderFiles.filter(folder.filter)
      : folderFiles;

  if (filteredFiles.length === 0) {
    logger.warn(`WARNING: no files found for ${folder}. Skipping.`);
    return;
  }

  let commands = Array.isArray(folder.command)
    ? folder.command
    : [folder.command];

  filteredFiles.forEach(filePath => {
    runCommands({ commands, filePath, relativeFolderPath });
  });

  logger.log(`INFO: ${relativeFolderPath} complete`);
});

function runCommands({ commands, filePath, relativeFolderPath }) {
  for (let command of commands) {
    let commandText;
    if (typeof command === 'function') {
      commandText = command(filePath);
    } else if (typeof command === 'string') {
      commandText = `${command} "${filePath}"`;
    } else {
      logger.warn(
        `WARNING: ${command} is an invalid type. Skipping any dependent commands.`
      );
      break;
    }

    if (command.length === 0) {
      logger.warn('WARNING: command is empty. Skipping.');
      continue;
    }

    logger.log(`INFO: ${commandText}`);

    try {
      execSync(commandText, {
        cwd: relativeFolderPath,
        stdio: 'inherit'
      });

      logger.log('INFO: execSync completed successfully');
    } catch (error) {
      logger.error(error);
      logger.error(
        'ERROR: execSync timed out or returned a non-zero exit code. Skipping any dependent commands.'
      );
      break;
    }
  }
}
