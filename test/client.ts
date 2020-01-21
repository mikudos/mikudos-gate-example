import _ from 'lodash';
import { MikudosSocketIoClient } from 'mikudos-socketio-client';
import { Message, MessageType } from './interfaces';

const client = new MikudosSocketIoClient(
  {
    uri: 'ws://localhost:3000',
    option: { transports: ['websocket'] },
  },
  { rpcEventName: 'rpc-call' },
);
client.chatEventEmitter.on('chat', data => {
  console.log('chat data:', data);
});

client.socket.on('connect', () => {
  client
    .authentication({
      strategy: 'local',
      email: '18534572861',
      password: 'qiushanyu666',
    })
    .then(res => {
      console.log('TCL: authentication -> res', res);
    })
    .catch(err => {
      console.log('TCL: err', err);
    });

  client.socket.on('pusher', (data: Message) => {
    console.log('received new pusher message: ', data);
    data.messageType = MessageType.RECEIVED;
    client.socket.emit('pusher', data);
  });
});
// setInterval(() => {
//   client
//     .rpcCall({
//       jsonrpc: '2.0',
//       method: 'rpc_1.add',
//       params: [1, 6],
//       id: 4,
//     })
//     .then(res => {
//       console.log('TCL: res', res);
//     })
//     .catch(err => {
//       console.log('TCL: err', err);
//     });
// }, 3000);

// setInterval(() => {
//   client
//     .sendChat()
//     .then(res => {
//       console.log('TCL: res', res);
//     })
//     .catch(err => {
//       console.log('TCL: err', err);
//     });
// }, 1000);
// setTimeout(() => {
//   client.joinChat();
// }, 5000);

// setTimeout(() => {
//   client.leaveChat();
// }, 15000);

// client.socket.on('stream-call grpc1.test', (data: any) => {
//   console.log('TCL: stream-call data', data);
// });
// setTimeout(() => {
//   client.socket.emit(
//     'stream-call',
//     {
//       method: 'grpc1.test',
//       data: { test: 'test' },
//     },
//     (res: any) => {
//       console.log('TCL: stream-call res', res);
//     },
//   );
// }, 3000);
