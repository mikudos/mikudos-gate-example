import { Application, CHAT_HANDLER } from 'mikudos-socketio-app';

export default function(app: Application) {
    app.chat_services = new CHAT_HANDLER(app);
}
