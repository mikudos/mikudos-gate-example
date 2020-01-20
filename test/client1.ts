import _ from 'lodash';
// import { MikudosSocketIoClient } from 'mikudos-socketio-client';

// const client = new MikudosSocketIoClient(
//   {
//     uri: 'ws://localhost:3000',
//   },
//   { rpcEventName: 'rpc-call' },
// );
// client.chatEventEmitter.on('chat', data => {
//   console.log('chat data:', data);
// });

// setInterval(() => {
//   client
//     .sendChat({ message: 'test message from client1', room: 'test' })
//     .then(res => {
//       console.log('TCL: res', res);
//     })
//     .catch(err => {
//       console.log('TCL: err', err);
//     });
// }, 2000);
// setTimeout(() => {
//   client.joinChat();
// }, 3500);

// setTimeout(() => {
//   client.leaveChat();
// }, 25000);

// client.socket.on('stream-call grpc1.test', (data: any) => {
//   console.log('TCL: stream-call data', data);
// });

// import io from 'socket.io-client';

// let socket = io('ws://localhost:3000', {
//   transports: ['websocket'],
// });
// let rootIo = io('/');
