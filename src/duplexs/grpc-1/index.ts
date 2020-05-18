import Grpc1 from './grpc-1.class';
import hooks from './before.hooks';
import { Application, mikudos, DUPLEX_HANDLER } from 'mikudos-socketio-app';

export default class Service implements mikudos.DuplexService {
  static serviceKey: string = 'grpc1';
  public serviceClass: any = Grpc1;
  public before: mikudos.duplexHooks = hooks;
  public service: { [key: string]: Function } = {};
  constructor(private handler: DUPLEX_HANDLER, private app: Application) {
    this.service = new this.serviceClass(this.handler, app);
  }
}
