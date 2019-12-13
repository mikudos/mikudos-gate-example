var SocketPromiseHandler = require('socket-stress-test');

socket_handler = new SocketPromiseHandler({
    ioUrl: 'http://127.0.0.1:3000/' // Your socket.io uri
    , connectionInterval: 1 // Fire one each second
    , maxConnections: 10000 // Stop at having 60000 connections
    , ioOptions: {
        transports: ['websocket'] // force only websocket (optional)
    }
});
let connectionNumber = 0;

socket_handler.new(function (socketTester, currentConnections) {
    // New connection comes in.
    console.log(++connectionNumber);
}).addEmit('message', { message: 'test message', room: 'test' }, 200).run();