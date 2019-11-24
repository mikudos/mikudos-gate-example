const socket = require('socket.io-client')('http://localhost:3000');
socket.on('connect', function() {
	console.log('connected');
});
socket.on('event', function(data: any) {
	console.log('TCL: data', data);
});
socket.on('disconnect', function() {
	console.log('TCL: disconnect');
});
setTimeout(() => {
	socket.emit('event', { test: 'tset' });
}, 3000);
