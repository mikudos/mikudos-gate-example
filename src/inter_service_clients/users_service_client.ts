import { Application } from 'mikudos-socketio-app';
const grpc_caller = require('grpc-caller');
import path from 'path';

// export default client;
export default function(app: Application) {
    let interClients = app.get('interClients');
    let serviceClients = { name: '127.0.0.1', port: '50051' };
    const file = path.resolve(__dirname, '../../proto/users/users.proto');
    const load = {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    };
    interClients.userClient = grpc_caller(
        `${serviceClients.name}:${serviceClients.port}`,
        { file, load },
        'UsersService'
    );
}
