import io from 'socket.io-client';
import _ from 'lodash';
import { EventEmitter } from 'events';

export default class MikudosSocketIoClient {
    socket: any;
    jwt?: string;
    responseEventEmitter: EventEmitter = new EventEmitter();
    constructor(
        { uri = 'ws://localhost:3000', option = {} }: any,

        public saveTokenCallback = (token: string) => {}
    ) {
        this.socket = io(uri, option);
        this.init();
    }

    init() {
        this.socket.on('connect', () => {
            console.log('connected');
            this.reauthentication();
        });
        this.socket.on('authentication', (data: any) => {
            this.responseEventEmitter.emit('authentication', data);
            this.jwt = _.get(data, 'accessToken');
            if (!this.jwt) return;
            this.saveTokenCallback.call(this, this.jwt);
        });
    }

    async authentication(data: object) {
        this.socket.emit('authentication', data);
        return await this.getRespose('authentication');
    }

    async getRespose(name: string) {
        return await new Promise((resolve, reject) => {
            this.responseEventEmitter.once(name, data => {
                if (data.error) reject(data), resolve(data);
            });
        });
    }

    async reauthentication() {
        if (!this.jwt) return;
        // auto reauthentication
        this.socket.emit('authentication', {
            strategy: 'jwt',
            accessToken: this.jwt
        });
        return await this.getRespose('authentication');
    }
}

const client = new MikudosSocketIoClient({});
setInterval(() => {
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
