import { Application, DUPLEX_HANDLER } from 'mikudos-socketio-app';
import grpc1 from './grpc-1';

export default function(app: Application) {
  app.duplex_services = new DUPLEX_HANDLER(app, genServices);
}

function genServices(handler: DUPLEX_HANDLER, app: Application) {
  return {
    grpc1: grpc1(handler, app),
  };
}
