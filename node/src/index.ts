import http from 'http';
import socket from 'socket.io';

const server = http.createServer();
const io = socket(server);

io.on('connection', client => {
	console.log('TCL: client conneted', client);
	client.on('event', data => {
		console.log('TCL: data', data);
		client.join('authenticated', () => {
			let rooms = Object.keys(client.rooms);
			console.log(rooms); // [ <socket.id>, 'room 237' ]
		});
		/* … */
	});
	client.on('disconnect', () => {
		console.log('TCL: client disconnect');
		console.log('rooms', client.rooms);
		client.leaveAll();
		/* … */
	});
});
server.listen(3000);
console.log('socket.io server started at port: 3000');
