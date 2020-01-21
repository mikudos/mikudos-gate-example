import path from 'path';
import { Application } from 'mikudos-socketio-app';
const grpc_caller = require('grpc-caller');

const file = path.resolve(
  __dirname,
  '../../proto/message-pusher/message-pusher.proto',
);
const load = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
export default function(app: Application) {
  const PusherService = grpc_caller(
    `${app.get('pusher.address')}:${app.get('pusher.port')}`,
    { file, load },
    app.get('pusher.service'),
  );
  return PusherService;
}
