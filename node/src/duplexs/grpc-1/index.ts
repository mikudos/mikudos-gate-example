import Grpc1 from './grpc-1.class';
import { Application } from 'mikudos-socketio-app';
import { EventEmitter } from 'events';

class Service {
    constructor(service: any) {}

    handle(
        namespace: string,
        method: string,
        data: any,
        socketEvent: EventEmitter
    ) {
        setInterval(() => {
            socketEvent.emit(`${namespace}.${method}`, data);
        }, 1000);
    }
}

export default function(app: Application) {
    return new Service(new Grpc1());
}
