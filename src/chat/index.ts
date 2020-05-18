import { Application, CHAT_HANDLER, mikudos } from 'mikudos-socketio-app';
const JsonRpcError = require('json-rpc-error');
import Debug from 'debug';
const debug = Debug('aomi_gate:chat');

export = function (app: Application): void {
  app.chat_services = new CHAT_HANDLER(
    app,
    {},
    {
      before: {
        all: [
          (data: any, socket: mikudos.Socket) => {
            if (!socket?.mikudos?.user) {
              throw new JsonRpcError('Not Authenticated', -32088, {
                info: '未认证的请求',
              });
            }
          },
        ],
      },
      after: {
        chat: [
          (data: any, socket: mikudos.Socket) => {
            // socket.emit('message', data);
          },
        ],
      },
    },
  );
};
