let execSync = require('child_process').execSync;

describe('cli', () => {
  it('should run command on all files in specified folder', () => {
    let output = execSync('node bin/bin.js test/cat.js');
    expect(output.toString()).toContain('sample-1-result');
    expect(output.toString()).toContain('sample-2-result');
  });

  it('should pass in filename when command is a function', () => {
    let output = execSync('node bin/bin.js test/cat-command.js');
    expect(output.toString()).toContain('sample-1-result');
    expect(output.toString()).toContain('sample-2-result');
  });

  it('should filter files when filter is a function', () => {
    let output = execSync('node bin/bin.js test/cat-filter.js');
    expect(output.toString()).toContain('sample-1-result');
  });

  it('should be able to load JSON file', () => {
    let output = execSync('node bin/bin.js test/cat.json');
    expect(output.toString()).toContain('sample-1-result');
    expect(output.toString()).toContain('sample-2-result');
  });
});
