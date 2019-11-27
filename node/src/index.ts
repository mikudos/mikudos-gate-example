import http from 'http';
import socket from 'socket.io';
import { Application } from './app';
import rpcs from './rpcs';
import auth from './app/authentication.class';
import message from './message';

const server = http.createServer();
const io = socket(server);

const app = new Application(io);
app.configure(auth);
app.configure(rpcs);
app.configure(message);

app.init();

server.listen(3000);
console.log('socket.io server started at port: 3000');
