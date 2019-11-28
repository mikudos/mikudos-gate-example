import http from 'http';
import socket from 'socket.io';
import { Application } from 'mikudos-socketio-app';
import rpcs from './rpcs';
import authentication from './authentication';
import message from './message';
import duplexs from './duplexs';

const server = http.createServer();
const io = socket(server);

const app = new Application(io);
app.configure(authentication);
app.configure(rpcs);
app.configure(message);
app.configure(duplexs);

app.init();

server.listen(app.get('port'));
console.log('socket.io server started at port: ' + app.get('port'));
