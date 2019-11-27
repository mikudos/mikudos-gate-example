import { Application, ChatHandler } from '../app';

export default function(app: Application) {
    app.chat_services = new ChatHandler();
}
