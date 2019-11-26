import http from 'http';
import socket from 'socket.io';
import { Application } from './ind';
import rpcs from './rpcs';
import auth from './authentication.class';

const server = http.createServer();
const io = socket(server);

const app = new Application();
app.configure(rpcs);
app.configure(auth);

app.bind(io);

server.listen(3000);
console.log('socket.io server started at port: 3000');
