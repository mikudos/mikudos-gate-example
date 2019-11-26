import { Application } from '../ind';
const JsonRpcError = require('json-rpc-error');
import rpc_1 from './rpc-1';

export class JSON_RPC_HANDLER {
    namespaces: any = {};
    constructor(app: Application) {
        this.namespaces = { rpc_1: rpc_1(app) };
    }

    async handle(namespace: string, method: string, request: any) {
        let result: any = {};
        try {
            result = await this.namespaces[namespace].handle(method, request);
        } catch (error) {
            result.error = this.parseError(error);
        }
        console.log('TCL: JSON_RPC_HANDLER -> handle -> result', result);
        return result;
    }

    parseError(error: Error) {
        if (error instanceof JsonRpcError) return error;
        else if (error instanceof Error)
            return new JsonRpcError(error.message, -32000, {});
        else return new JsonRpcError('internal Error', -32000, {});
    }
}

export default function(app: Application) {
    app.json_rpc_services = new JSON_RPC_HANDLER(app);
}
