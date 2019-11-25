export class AuthenticationRequest {
    strategy?: string;
    [key: string]: any;
}

export class Authentication {
    constructor() {}
    async authenticate(data: AuthenticationRequest) {
        return {
            accessToken: 'token',
            authentication: {
                strategy: 'local'
            }
        };
    }
}
