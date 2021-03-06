# node-shell-batcher

## A CLI for running batches of shell commands on folders.

## How to Use

`npx node-shell-batcher <path>`

`npx node-shell-batcher ./path/to/batch.js`

`npx node-shell-batcher ./path/to/batch.json`

### Batch File (required argument)

`node-shell-batcher` requires the path to a "batch" file, which must contain an array of objects. These objects will need to at least contain a `path` to a folder, and a `command` to run on each file in that folder.

| Option  | Type                                      | Required | Description                                                                                                                                                                                 |
| ------- | ----------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| command | String\|Function\|Array<String\|Function> | true     | A string that represents a shell command, or a function that is passed the current filename and must return a string. An array of dependent strings or functions is also supported.         |
| path    | String                                    | true     | Path to folder where `command` will be run for each file.                                                                                                                                   |
| filter  | Function                                  | false    | Passed into [`Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) to filter selected files in folder run for `command`. |

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
  },
  {
    path: './path/to/folder2',
    command: [
      'cat',
      'cat',
      filename => {
        return `cat "${filename}"`;
      }
    ]
  }
];

module.exports = batch;
```

### Additional Options

| Option    | Short Flag | Required | Description                |
| --------- | ---------- | -------- | -------------------------- |
| --version | -v         | false    | Output the version number. |
| --help    | -h         | false    | Output usage information.  |
