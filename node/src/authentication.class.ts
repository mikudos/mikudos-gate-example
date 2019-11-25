import rp from 'request-promise-native';
import _ from 'lodash';

export class AuthenticationRequest {
    strategy?: string;
    [key: string]: any;
}

export class Authentication {
    requsetOption: any = {
        method: 'POST',
        uri: 'http://127.0.0.1:3030/authentication',
        headers: {
            'Content-Type': 'application/json'
        },
        json: true
    };
    constructor({ protocol, host, port, method }: any = {}) {
        this.requsetOption.uri = ``
    }

    async authenticate(body: AuthenticationRequest) {
        let option = { body, ...this.requsetOption };
        console.log('TCL: Authentication -> authenticate -> option', option);
        return await rp({ body, ...this.requsetOption });
    }
}
