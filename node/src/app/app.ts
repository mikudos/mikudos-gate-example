import socket from 'socket.io';
import _ from 'lodash';
import { JSON_RPC_HANDLER } from './common/json-rpc-handler';
import { Authentication, AuthenticationRequest } from './authentication.class';
import { ChatHandler } from './common';

declare namespace mikudos {
    interface ConfigFunc {
        (app: Application): void;
    }
}

export class Application {
    io: socket.Server;
    json_rpc_services?: JSON_RPC_HANDLER;
    chat_services?: ChatHandler;
    authentication?: Authentication;
    [key: string]: any;
    constructor(io: socket.Server) {
        this.io = io;
    }

    bind(io: socket.Server) {
        this.io = io;
        this.socketInit();
    }

    init() {
        this.socketInit();
    }

    configure(fn: mikudos.ConfigFunc): Application {
        fn.call(this, this);

        return this;
    }

    socketInit() {
        this.io.on('connection', (socket: socket.Socket) => {
            socket.use((reqData: any, next) => {
                this.parseRequset(reqData, socket);
                next();
            });

            // if json_rpc_services configured, then listen the coresponding event
            if (this.json_rpc_services) {
                socket.on(
                    this.json_rpc_services.eventPath,
                    async (request: any) => {
                        if (!this.io || !this.json_rpc_services) return;
                        const [namespace, method] = String(
                            request.method
                        ).split('.');
                        let response: any = await this.json_rpc_services.handle(
                            namespace,
                            method,
                            request
                        );
                        response.method = `${namespace}.${method}`;
                        socket.emit(this.json_rpc_services.eventPath, response);
                        this.publishEvent(response);
                    }
                );
            }

            if (this.authentication) {
                socket.on(
                    'authentication',
                    async (data: AuthenticationRequest) => {
                        if (!this.authentication)
                            throw new Error(
                                'Authentication must be generate first!'
                            );
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
                    }
                );
            }

            if (this.chat_services) {
                socket.on('message', data => {
                    // chat message
                    console.log('TCL: data', data);
                    console.log('sockets', this.io.sockets.sockets);
                });
            }

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
            socket.on('disconnecting', reason => {
                let rooms = Object.keys(socket.rooms);
                // ...
            });
        });
    }

    publishEvent(response: any) {
        // this.io.to('authenticated').emit('rpc-call event', response);
        this.io.in('authenticated').clients((error: any, clients: any) => {
            if (error) throw error;
            console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
            (clients as any[])
                .filter(client => client)
                .map(clientRoom => {
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
        // if request is jsonrpc request then parse the request
        request[1] = _.pick(request[1], ['jsonrpc', 'id', 'method', 'params']);
        request[1].socket = socket;
    }
}
