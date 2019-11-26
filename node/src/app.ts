import socket from 'socket.io';
import _ from 'lodash';
import { JSON_RPC_HANDLER } from './rpcs';
import { Authentication, AuthenticationRequest } from './authentication.class';

declare namespace mikudos {
    interface ConfigFunc {
        (app: Application): void;
    }
}

export class Application {
    io?: socket.Server;
    json_rpc_services?: JSON_RPC_HANDLER;
    authentication?: Authentication;
    constructor() {}

    bind(io: socket.Server) {
        this.io = io;
        this.socketInit();
    }

    configure(fn: mikudos.ConfigFunc): Application {
        fn.call(this, this);

        return this;
    }

    socketInit() {
        if (!this.io)
            throw new Error(
                'socket.io server must be bind to Application use app.bind(io)'
            );
        this.io.on('connection', (socket: socket.Socket) => {
            socket.use((reqData: any, next) => {
                this.parseRequset(reqData, socket);
                next();
            });
            socket.on('message', data => {
                // chat message
                console.log('TCL: data', data);
                console.log(
                    'sockets',
                    this.io ? this.io.sockets.sockets : null
                );
            });

            socket.on('rpc-call', async (request: any) => {
                if (!this.io || !this.json_rpc_services) return;
                const [namespace, method] = String(request.method).split('.');
                let response: any = await this.json_rpc_services.handle(
                    namespace,
                    method,
                    request
                );
                response.method = `${namespace}.${method}`;
                socket.emit('rpc-call', response);
                this.publishEvent(response);
                this.io.to('authenticated').emit('rpc-call event', response);
            });

            socket.on('authentication', async (data: AuthenticationRequest) => {
                if (!this.authentication)
                    throw new Error('Authentication must be generate first!');
                const Auth = this.authentication;
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
    }

    publishEvent(response: any) {
        if (!this.io) throw new Error('Application.io is not exist');
        this.io.in('authenticated').clients((error: any, clients: any) => {
            if (error) throw error;
            console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
            (clients as any[])
                .filter(client => client)
                .map(clientRoom => {
                    if (!this.io) return;
                    this.io.to(clientRoom).emit('rpc-call event', response);
                });
        });
    }

    parseRequset(request: any, socket: socket.Socket) {
        (socket as any).mikudos = {
            provider: 'socketio',
            headers: socket.handshake.headers,
            remoteAddress: socket.conn.remoteAddress
        };
        if (request.length === 1) return;
        if (!request[1].jsonrpc) return;
        request[1] = _.pick(request[1], ['jsonrpc', 'id', 'method', 'params']);
        request[1].socket = socket;
    }
}
