const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    var from = "Billy";
    var text = "Some message";
    var message = generateMessage(from, text);
    expect(message).toInclude({from, text});
    expect(message.createdAt).toBeA('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = "Admin";
    var lat = "26.6750895"
    var long = "-80.0625847"
    var url = `https://www.google.com/maps?q=26.6750895,-80.0625847`;
    var message = generateLoc ationMessage(from, lat, long);
    expect(message).toInclude({from, url});
    expect(message.url).toBe(url);
  });
});
