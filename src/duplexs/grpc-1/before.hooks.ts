import socket from 'socket.io';

export default {
  all: [async (methodPath: string, data: any, socket: socket.Socket) => data],
};
