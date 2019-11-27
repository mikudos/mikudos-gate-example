import { HandlerBase } from './handler-base';

export class ChatHandler extends HandlerBase {
    constructor({ eventPath = 'rpc-call' } = {}) {
        super(eventPath);
    }
}
