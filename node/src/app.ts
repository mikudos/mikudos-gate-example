import http from 'http';
import socket from 'socket.io';
import _ from 'lodash';

export class Application {
    io: socket.Server;
    constructor(
        { withHttp, port, server }: any = { port: 3000, withHttp: true }
    ) {
        if (withHttp) {
            server = http.createServer();
        }
        this.io = socket(server || port);
        this.init();
    }

    init() {
        this.io.on('connection', client => {
            (client as any).mikudos = {
                provider: 'socketio',
                headers: client.handshake.headers,
                address: client.conn.remoteAddress
            };
        });
    }

    parseRequset(request: any, client: socket.Socket) {
        request = _.pick(request, ['jsonrpc', 'id', 'method', 'params']);
        request.headers = client.handshake.headers;
        request.remoteAddress = client.client.conn.remoteAddress;
        request.request = client.request;
        return request;
    }
}
