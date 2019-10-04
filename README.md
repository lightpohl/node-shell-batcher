# node-shell-batcher

## A CLI for running batches of shell commands on folders.

[![NPM Version](https://img.shields.io/npm/v/node-md-meta-cataloger.svg?style=flat)](https://www.npmjs.com/package/node-shell-batcher)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## How to Use

`npx node-shell-batcher <path>`

`npx node-shell-batch ./path/to/batch.js`

`npx node-shell-batcher --help`

| Option    | Short Flag | Required | Description               |
| --------- | ---------- | -------- | ------------------------- |
| --version | -v         | false    | output the version number |
| --help    | -h         | false    | output usage information  |

### Batch File (required argument)

`node-shell-batcher` requires the path to a "batch" file, which must contain an array of objects. These objects will need to at least contain a `path` to a folder, and a `command` to run on each file in that folder.

| Option  | Type             | Required | Description                                                                   |
| ------- | ---------------- | -------- | ----------------------------------------------------------------------------- |
| path    | String           | true     | path to folder where `command` should be run on each file                     |
| command | String\|Function | true     | a string that represents a shell command, or a function that returns a string |
| filter  | Function         | false    | will be passed into `Array.prototype.filter` for the folders files            |

#### Example Batch File

```js
let batch = [
  {
    path: './path/to/folder',
    command: 'cat'
  },
  {
    path: './path/to/another/folder',
    command: filename => {
      return `cat "${filename}"`;
    }
  },
  {
    path: './path/to/yet/another/folder',
    command: 'cat',
    filter: filename => {
      return filename.endsWith('.txt');
    }
  }
];

module.exports = batch;
```
