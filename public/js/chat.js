// This is the client side code

// the socket variable is declared in order to make the library accessible
var socket = io();

// a necessary custom implementation of an autosroll feature
function scrollToBottom () {
  // Selectors
  var messages = jQuery("#messages");
  var newMessage = messages.children('li:last-child');
  // Heights
  // the following three variables are accessible via jquery using props? i dont 100% understand this
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    // the following sets the scrollTop variable, making the screen scroll
    messages.scrollTop(scrollHeight);
  }
};

// this is actually an unnecessary funcion which simply prints a message to the client side console when connected.
socket.on('connect', function()  {
  console.log('Connected to server');

});

// this too, except when disconnected
socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

// when a 'newMessage' event is emitted from the server the following code fires
socket.on('newMessage', function(message) {
  // formatted time using moment library on the client side
  var formattedTime = moment(message.createdAt).format('h:mm a')
  // select just the HTML from the mustache template in index.html
  var template = jQuery('#message-template').html();
  // this is how the data is passed into the mustache template, via the render function
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  // jquery method for appending the newly recieved message
  jQuery("#messages").append(html);
  // implement custom autoscroll function
  scrollToBottom();
});

// does the same as above, except for the specific case of a location message
socket.on('newLocationMessage', function(message) {
  var formattedTime = moment(message.createdAt).format('h:mm a')
  var template = jQuery("#location-message-template").html();
  var html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery("#messages").append(html);
  scrollToBottom();
});


// using jquery to manipulate what happens when the submit button is pressed
jQuery('#message-form').on('submit', function (e) {
  // this prevents default action of submit button, which would refresh the page
  e.preventDefault();

  // set variable equal to the message text field
  var messageTextbox = jQuery('[name=message]')

  // this is where the client actually emits a 'createMessage' event to the server
  // the event type or name or whatever is the first argument, and the data to be passed is the second argument
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('');
  });
});

// bascially does the same as above except for a regular button, without a form field
var locationButton = jQuery('#send-location');
// the button is not a submit button, so on 'click' must be used
locationButton.on('click', function () {
  // checks for location support
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.');
  }

  // while the action is working the button is temporarily disabled
  locationButton.attr('disabled', 'disabled').text('Sending Location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    // set the send location button back to normal and enable it again; the call to API is finished
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    // this is the callback function passed back to the server to be called once the first action is attempted
    locationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location.');
  })
});
