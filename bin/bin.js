#!/usr/bin/env node

let program = require('commander');
let fs = require('fs');
let path = require('path');
let execSync = require('child_process').execSync;
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
  console.error('ERROR: no JSON or JS file provided as an argument');
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
  console.error(`ERROR: unable to load ${relativeBatchPath}`);
  process.exit(1);
}

folderList.forEach(folder => {
  let relativeFolderPath = path.resolve(relativeBatchParentPath, folder.path);
  let folderFiles = fs.readdirSync(relativeFolderPath);

  console.log(`INFO: starting ${relativeFolderPath}`);

  let filteredFiles =
    typeof folder.filter === 'function'
      ? folderFiles.filter(folder.filter)
      : folderFiles;

  filteredFiles.forEach(filePath => {
    let relativeFilePath = path.resolve(relativeFolderPath, filePath);
    let fileStats = fs.lstatSync(relativeFilePath);

    if (!fileStats.isFile()) {
      return;
    }

    let commandArray = Array.isArray(folder.command)
      ? folder.command
      : [folder.command];

    for (let command of commandArray) {
      // Use regular file path because we will run execSync from inside folder
      let commandText =
        typeof command === 'function'
          ? command(filePath)
          : `${command} "${filePath}"`;

      console.log(`INFO: ${commandText}`);

      try {
        execSync(commandText, {
          cwd: relativeFolderPath,
          stdio: 'inherit'
        });

        console.log('INFO: execSync completed successfully');
      } catch (error) {
        console.error(
          'ERROR: execSync timed out or returned a non-zero exit code'
        );
        console.error('ERROR: any dependent commands will be skipped');
        break;
      }
    }
  });

  console.log(`INFO: ${relativeFolderPath} complete`);
});
