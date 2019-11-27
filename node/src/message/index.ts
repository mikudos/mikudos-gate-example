import { Application, ChatHandler } from 'mikudos-socketio-app';

export default function(app: Application) {
    app.chat_services = new ChatHandler(app);
}
