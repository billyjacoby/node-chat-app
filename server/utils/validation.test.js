const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    var test = 123456;
    expect(isRealString(test)).toBe(false);
  });
  it('should reject string with only spaces', () => {
    var test = "          ";
    expect(isRealString(test)).toBe(false);
  });
  it('should allow string with non-space characters', () => {
    var test = "im a string";
    expect(isRealString(test)).toBe(true);
  });
});
