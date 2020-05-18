/*
Copyright © 2020 Julian Yue <yue.guanyu@hotmail.com>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import http from 'http';
import socket from 'socket.io';
import { Application } from 'mikudos-socketio-app';
import rpcs from './rpcs';
import publish from './publish';
import authentication from './authentication';
import pusher from './pusher';
import message from './chat';
import duplexs from './duplexs';
import inter_service_clients from './inter_service_clients';

const server = http.createServer();
const io = socket(server, {
  transports: ['websocket'],
});

const app = new Application(io);
app.configure(inter_service_clients);
app.configure(authentication);
app.configure(pusher);
app.configure(rpcs);
app.configure(publish);
app.configure(message);
app.configure(duplexs);

app.init();

server.listen(app.get('port'));
console.log('socket.io server started at port: ' + app.get('port'));
