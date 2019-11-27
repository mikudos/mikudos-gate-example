import { Application, JSON_RPC_HANDLER } from '../app';
const JsonRpcError = require('json-rpc-error');
import rpc_1 from './rpc-1';

export default function(app: Application) {
    app.json_rpc_services = new JSON_RPC_HANDLER(
        { rpc_1: rpc_1(app) },
        { eventPath: 'rpc-call' }
    );
}
