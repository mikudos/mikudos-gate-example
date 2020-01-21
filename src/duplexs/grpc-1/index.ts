import Grpc1 from './grpc-1.class';
import hooks from './before.hooks';
import { Application, mikudos, DUPLEX_HANDLER } from 'mikudos-socketio-app';
import { EventEmitter } from 'events';

class Service implements mikudos.DuplexService {
  public service: { [key: string]: Function };
  constructor(
    public before: { [key: string]: mikudos.DuplexHandle[] } = {},
    public serviceClass: any,
    private handler: DUPLEX_HANDLER,
    private app: Application,
  ) {
    this.service = new serviceClass(this.handler, app);
  }
}

export default function(handler: DUPLEX_HANDLER, app: Application) {
  return new Service(hooks, Grpc1, handler, app);
}
