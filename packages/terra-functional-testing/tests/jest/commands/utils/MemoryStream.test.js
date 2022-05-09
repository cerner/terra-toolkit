const MemoryStream = require('../../../../src/commands/utils/MemoryStream');

describe('MemoryStream', () => {
  it('tracks the length of the stream', () => {
    const memoryStream = new MemoryStream();
    memoryStream.write(Buffer.from('test string'), () => {
      expect(memoryStream.length).toEqual(11);
    });
  });
});
