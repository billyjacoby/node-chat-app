// library for joining paths neatly
const path = require('path');
// node standard library for http handling
const http = require('http');
// library for creating a server and routes
const express = require('express');
// library for two way communcation between the clietn and the server
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
// creates the public path for files to be accessible to the client
const publicPath = path.join(__dirname, '../public' );
// sets the port to either 3000 or whatever Heroku needs it to be in order for it to work
const port = process.env.PORT || 3000;
// initialize express application
var app = express();
// create variable for accessing node http server
var server = http.createServer(app);
// create a variable for accessing the socket main function on the node http server
var io = socketIO(server);
var users = new Users()

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

// allow the client to view and server all files in the /public directory
app.use(express.static(publicPath));

// initlaizes the socket connection. the funciton takes socket as a variable
io.on('connection', (socket) => {
  // this logs new user connected to the server console upon a new connection
  console.log('New user connected');



  socket.on('join', (params, callback) => {

    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    // this is how you join a specific 'room'
    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    // socket.leave(params.room);

    // io.emit - everyone connected -> io.to('Room Name').emit
    // socket.broadcast - everyone except for the initiating user -> socket.broadcast.to("room name").emit
    // socket.emit - only to the initiating user -> socket.emit is unchanged

    // emit a 'newMessage' event from Admin, to new user
    socket.emit('newMessage', generateMessage("Admin", "Welcome to the chat app"));
    // emit a 'createMessage' event from admin, to everyone except the new user
    socket.broadcast.to(params.room).emit('newMessage', generateMessage("Admin", `${params.name} has joined the chat.`));
    callback();
  });

  // whenever a 'createMessage' event is emitted from a client the following code fires
  socket.on('createMessage', (message, callback) => {
    // logs this message to the server console
    // console.log('createMessage', message);
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      // io.emit will perform the function passed into it to every single user, including the one who sent it
      io.to(user.room).emit('newMessage', generateMessage(toTitleCase(user.name), message.text));
    }

    // im not 100% sure what this does, something about acknowledgements or something?
    callback();
  });

  // whwnever a 'createLocationMessage' event is emitted from a client this code fires
  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if (user) {
      // performs this function for everyone in the room
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }

  });

  socket.on('disconnect', () => {
    // simply prints a statemtnet to the server console when a user disconnects
    // console.log('User was disconnected');
    var user = users.removeUser(socket.id);

    if (user) {
    io.to(user.room).emit("updateUserList", users.getUserList(user.room));
    io.to(user.room).emit('newMessage', generateMessage("Admin", `${user.name} has left the chat.`));
    }
  });
});

// server.listen must be used rather than app.listen when using socket.io
server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
