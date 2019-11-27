import _ from 'lodash';
import { MikudosSocketIoClient } from 'mikudos-socketio-client';

const client = new MikudosSocketIoClient(
    {
        uri: 'ws://localhost:3000'
    },
    { rpcEventName: 'rpc-call' }
);
setTimeout(() => {
    client
        .authentication({
            strategy: 'local',
            email: '18534572861',
            password: 'qiushanyu666'
        })
        .then(res => {
            console.log('TCL: res', res);
        })
        .catch(err => {
            console.log('TCL: err', err);
        });
}, 3000);
setInterval(() => {
    client
        .rpcCall({
            jsonrpc: '2.0',
            method: 'rpc_1.add',
            params: [1, 6],
            id: 4
        })
        .then(res => {
            console.log('TCL: res', res);
        })
        .catch(err => {
            console.log('TCL: err', err);
        });
}, 3000);
setTimeout(() => {
    client
        .rpcCall({
            jsonrpc: '2.0',
            method: 'rpc_1.getUser',
            params: [],
            id: 4
        })
        .then(res => {
            console.log('TCL: res', res);
        })
        .catch(err => {
            console.log('TCL: err', err);
        });
}, 1000);
