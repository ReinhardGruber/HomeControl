var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
  



var socketServer = server.listen(80);
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor




var sp = new SerialPort("/dev/ttyACM0", {
  parser: serialport.parsers.readline("\r\n")
});

sp.on("data", function (data) {

	if(data == '1')
	{
		io.sockets.emit('opencmd', 'arduino', 'valve1001');
		io.sockets.emit('openvalve', 'arduino', 'valve1001');
		
	}
	else
	{
		io.sockets.emit('closecmd', 'arduino', 'valve1001');
		io.sockets.emit('closevalve', 'arduino', 'valve1001');
	}


//io.sockets.emit('updatechat', 'arduino', data);

//	socketServer.emit('updatechat', data);
//socketServer.broadcast.emit('updatechat', 'SERVER', data + ' has disconnected');
//  sys.puts("here: "+data);
});



//socketServer = server.listen(80);

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');  
});

app.get('/app.css', function (req, res) {
  res.sendfile(__dirname + '/app.css');  
});

// usernames which are currently connected to the chat
var usernames = {};

io.sockets.on('connection', function (socket) {

// when the client emits 'sendchat', this listens and executes
socket.on('sendchat', function (data) {
// we tell the client to execute 'updatechat' with 2 parameters
io.sockets.emit('updatechat', socket.username, data);
});

// when the client emits 'opencmd', this listens and executes
socket.on('opencmd', function (data) {
// Add calls to IO here
io.sockets.emit('opencmd', socket.username, data);
setTimeout(function () {
  io.sockets.emit('openvalve', socket.username, data);
}, 1000)
});

// when the client emits 'closecmd', this listens and executes
socket.on('closecmd', function (data) {
// Add calls to IO here
io.sockets.emit('closecmd', socket.username, data);
setTimeout(function () {
  io.sockets.emit('closevalve', socket.username, data);
}, 1000)
});

// when the client emits 'adduser', this listens and executes
socket.on('adduser', function(username){
// we store the username in the socket session for this client
socket.username = username;
// add the client's username to the global list
usernames[username] = username;
// echo to client they've connected
socket.emit('updatechat', 'SERVER', 'you have connected');
// echo globally (all clients) that a person has connected
socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
// update the list of users in chat, client-side
io.sockets.emit('updateusers', usernames);
});

// when the user disconnects.. perform this
socket.on('disconnect', function(){
// remove the username from global usernames list
delete usernames[socket.username];
// update list of users in chat, client-side
io.sockets.emit('updateusers', usernames);
// echo globally that this client has left
socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
});

});
