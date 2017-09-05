
class Users {
  constructor () {
    this.users = [];
  }
  addUser (id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }
  removeUser (id) {
    // var removedUser;
    // this.users.forEach((currentValue, index, array) => {
    //   if (currentValue.id === id) removedUser = array.splice(index, 1)[0];
    // });
    // return removedUser;
    var user = this.getUser(id);

    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }

    return user;
  }
  getUser (id) {
    // var gotUser;
    // this.users.forEach((currentValue, index, array) => {
    //   if (currentValue.id === id) gotUser = array[index];
    // })
    // return gotUser;
    return this.users.filter((user) => user.id === id)[0];
  }
  getUserList(room) {
    // my way:
    // var userList = [];
    // this.users.forEach((currentValue, index, array) => {
    //   if (currentValue.room === room) userList.push(currentValue.name);
    // });
    // return userList;
    return this.users.filter((user) => user.room === room).map((user) => user.name);
    // return namesArray;
  }

}
// var users = new Users();
//
// console.log(users.getUserList('room'));
module.exports = {Users};
