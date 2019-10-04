let batch = [
  {
    path: './sample',
    command: filename => {
      return `cat "${filename}"`;
    }
  }
];

module.exports = batch;
