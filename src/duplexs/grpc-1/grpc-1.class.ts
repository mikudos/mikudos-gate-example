import { EventEmitter } from 'events';
import path from 'path';
import { Application } from 'mikudos-socketio-app';
const grpc_caller = require('grpc-caller');

/**
 * all duplex call method must fill ... method
 */

const file = path.resolve(
  __dirname,
  '../../../proto/event_sync/event_sync.proto',
);
const load = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
function initEventSyncer(app: Application) {
  return grpc_caller(
    `${app.get('event_sync.address')}:${app.get('event_sync.port')}`,
    { file, load },
    app.get('event_sync.service'),
  );
}

export default class DuplexHandleClass {
  private syncService: any;
  private testCall: any;
  constructor(app: Application) {
    this.syncService = initEventSyncer(app);
    this.testCall = this.syncService.EventSyncSceneInstance({
      // metadata
    });
    // response the streamCall
    this.testCall.on('data', (data: any) => {
      let socketId = data.socketId;
      //    find the correspond socket eventemitter and emit event
      //   this
      //   socketEvent.emit(eventName, data);
    });
  }
  async EventSyncSceneInstance(
    eventName: string,
    data: any,
    socketEvent: EventEmitter,
  ) {
    // write data to the streamCall
    this.testCall.write(data);

    // client send
    socketEvent.on(`${eventName} send`, send => {
      // send to the call
    });
    // client cancel
    socketEvent.once(`${eventName} cancel`, cancel => {
      // cancel
      // return something to client
      socketEvent.emit(`${eventName} cancel`, {
        result: { success: true },
      });
    });
    // server end
    socketEvent.emit(eventName, { method: eventName, end: true });
    socketEvent.removeAllListeners(`${eventName}`);
    // call canceled from server
    if (true) {
      socketEvent.emit(eventName, { method: eventName, cancel: true });
      socketEvent.removeAllListeners(`${eventName}`);
    }
  }
}
