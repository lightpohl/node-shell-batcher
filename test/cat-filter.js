let batch = [
  {
    path: './sample',
    command: filename => {
      return `cat "${filename}"`;
    },
    filter: filename => {
      return filename.endsWith('1.txt');
    }
  }
];

module.exports = batch;
