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

  it('should support array of commands', () => {
    let output = execSync('node bin/bin.js test/cat-array.js');
    expect(output.toString().match(/sample-1-result/g).length).toBe(2);
    expect(output.toString().match(/sample-2-result/g).length).toBe(2);
  });

  it('should bail out of command array if one command fails', () => {
    let outputString = execSync(
      'node bin/bin.js test/cat-array-fail.js'
    ).toString();
    expect((outputString.match(/sample-1-result/g) || []).length).toBe(0);
    expect((outputString.match(/sample-2-result/g) || []).length).toBe(0);
  });

  it('should continue successfully if a command is empty', () => {
    let output = execSync('node bin/bin.js test/empty.js');
    expect(output.toString().match(/sample-1-result/g).length).toBe(1);
    expect(output.toString().match(/sample-2-result/g).length).toBe(1);
  });

  it('should skip invalid folder path', () => {
    let output = execSync('node bin/bin.js test/wrong-folder.js');
    expect(output.toString()).toContain('sample-1-result');
    expect(output.toString()).toContain('sample-2-result');
  });

  it('should skip invalid command types', () => {
    let outputString = execSync(
      'node bin/bin.js test/invalid-types.js'
    ).toString();
    expect((outputString.match(/sample-1-result/g) || []).length).toBe(0);
    expect((outputString.match(/sample-2-result/g) || []).length).toBe(0);
  });
});
