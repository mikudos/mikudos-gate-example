import http from 'http';
import socket from 'socket.io';
import _ from 'lodash';
import { AuthenticationRequest, Authentication } from './authentication.class';
import { JSON_RPC_HANDLER } from './rpcs';

const server = http.createServer();
const io = socket(server);
const JSON_RPC = new JSON_RPC_HANDLER();

function parseRequset(request: any, client: socket.Socket) {
    request = _.pick(request, ['jsonrpc', 'id', 'method', 'params']);
    request.headers = client.handshake.headers;
    request.remoteAddress = client.client.conn.remoteAddress;
    request.request = client.request;
    return request;
}

io.on('connection', socket => {
    (socket as any).mikudos = {
        provider: 'socketio',
        headers: socket.handshake.headers,
        address: socket.conn.remoteAddress
    };
    // console.log('TCL: mikudos', (client as any).mikudos);
    // console.log('TCL: client conneted nsp', client.nsp);
    // console.log('TCL: client conneted id', client.id);
    // console.log('TCL: client conneted handshake', client.handshake);
    // console.log('TCL: client conneted request', client.request);
    socket.on('message', data => {
        // chat message
        console.log('TCL: client', socket);
        // request message
        console.log('TCL: data', data);
    });
    socket.on('rpc-call', async (request: any) => {
        const [namespace, method] = String(request.method).split('.');
        request = parseRequset(request, socket);
        let response: any = await JSON_RPC.handle(namespace, method, request);
        response.method = `${namespace}.${method}`;
        console.log('TCL: response', response);
        socket.emit('rpc-call', response);
        io.in('authenticated').clients((error: any, clients: any) => {
            if (error) throw error;
            console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
            (clients as any[])
                .filter(client => client)
                .map(clientRoom => {
                    io.to(clientRoom).emit('rpc-call event', response);
                });
        });
        io.to('authenticated').emit('rpc-call event', response);
    });
    socket.on('authentication', async (data: AuthenticationRequest) => {
        const Auth = new Authentication({
            port: 3030
        });
        try {
            const authResult = await Auth.authenticate(data);
            let token = _.get(authResult, Auth.tokenPath);
            if (!token)
                throw new Error(
                    `Can not find Token at path: ${Auth.tokenPath}`
                );
            socket.handshake.headers.authentication = token;
            socket.request.user = authResult.user;
            socket.emit('authentication', authResult);
        } catch (error) {
            socket.emit('authentication', {
                code: 501,
                message: 'Authentication Request Error!',
                error: {
                    info: error.message
                }
            });
        }
        socket.join('authenticated', () => {
            let rooms = Object.keys(socket.rooms);
            console.log(rooms); // [ <socket.id>, 'room 237' ]
        });
    });
    socket.on('event', data => {
        console.log('TCL: data', data);
        /* … */
    });
    socket.once('disconnect', () => {
        console.log('TCL: client disconnect');
        console.log('rooms', socket.rooms);
        socket.leaveAll();
        /* … */
    });
});
server.listen(3000);
console.log('socket.io server started at port: 3000');
