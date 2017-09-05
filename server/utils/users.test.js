const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node Course'
      },{
      id: '2',
      name: 'Jen',
      room: 'React Course'
      }, {
      id: '3',
      name: 'Julie',
      room: 'Node Course'
      }]
  });
  it('should add new user', () => {
    var users = new Users();
    var user = {
      id: 123,
      name: "Name",
      room: "Room"
    };
    var resUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });
  it('should remove a user', () => {
    var user = users.users[0];
    var deletedUser = users.removeUser('1');

    expect(users.users.length).toBe(2);
    expect(deletedUser).toEqual(user);
  });
  it('should not remove user', () => {
    var deletedUser = users.removeUser('9');
    expect(deletedUser).toNotExist();
  });
  it('should find user', () => {
    var user = users.users[1];
    var gotUser = users.getUser(users.users[1].id);

    expect(gotUser).toEqual(user);
  });
  it('should not find user', () => {
    var gotUser = users.removeUser('9');
    expect(gotUser).toNotExist();
  });
  it('should return names for node course', () => {
    var userList = users.getUserList('Node Course');
    expect(userList).toEqual(['Mike', 'Julie']);
  });
  it('should return names for react course', () => {
    var userList = users.getUserList('React Course');
    expect(userList).toEqual(['Jen']);
  });

})
