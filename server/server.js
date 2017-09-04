// library for joining paths neatly
const path = require('path');
// node standard library for http handling
const http = require('http');
// library for creating a server and routes
const express = require('express');
// library for two way communcation between the clietn and the server
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
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

// allow the client to view and server all files in the /public directory
app.use(express.static(publicPath));

// initlaizes the socket connection. the funciton takes socket as a variable
io.on('connection', (socket) => {
  // this logs new user connected to the server console upon a new connection
  console.log('New user connected');

  // emit a 'newMessage' event from Admin, to new user
  socket.emit('newMessage', generateMessage("Admin", "Welcome to the chat app"));

  // emit a 'createMessage' event from admin, to everyone except the new user
  socket.broadcast.emit('newMessage', generateMessage("Admin", "New user has joined"));

  // whenever a 'createMessage' event is emitted from a client the following code fires
  socket.on('createMessage', (message, callback) => {
    // logs this message to the server console
    console.log('createMessage', message);
    // io.emit will perform the function passed into it to every single user, including the one who sent it
    io.emit('newMessage', generateMessage(message.from, message.text));
    // im not 100% sure what this does, something about authoriation or something?
    callback();
  });

  // whwnever a 'createLocationMessage' event is emitted from a client this code fires
  socket.on('createLocationMessage', (coords) => {
    // again, performs this function for everyone on the server
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    // simply prints a statemtnet to the server console when a user disconnects
    console.log('User was disconnected');
  });
});

// server.listen must be used rather than app.listen when using socket.io 
server.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
