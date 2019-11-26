import Rpc1 from './rpc-1.class';
import hooks from './rpc-1.hooks';
import { ServiceMethods } from '../common';

class Service extends ServiceMethods {
    constructor(hooks: { before: any; after: any; error: any }, service: any) {
        super(hooks, service);
    }
}

export default function(app: any) {
    return new Service(hooks, new Rpc1());
}
