import _ from 'lodash';
const socket = require('socket.io-client')('http://localhost:3000', {});
socket.on('connect', function() {
    console.log('connected');
    // auto reauthentication
    // socket.emit('authentication', {
    //     strategy: 'jwt',
    //     accessToken: 'test token'
    // });
});
socket.on('message', (data: any) => {
    // response message
    console.log('TCL: data', data);
    console.log('TCL: socket', socket);
});
socket.on('event', function(data: any) {
    console.log('TCL: data', data);
});
socket.on('disconnect', function() {
    console.log('TCL: disconnect');
});
socket.on('authentication', (data: any) => {
    console.log('TCL: data', data);
    const token = _.get(data, 'accessToken');
});
setTimeout(() => {
    socket.emit('event', { test: 'tset' });
    socket.send({ test: 'test' });
    socket.emit('authentication', {
        strategy: 'local',
        email: '18534572861',
        password: 'qiushanyu666'
    });
}, 3000);
