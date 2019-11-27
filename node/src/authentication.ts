import { Application, Authentication } from 'mikudos-socketio-app';

export default function(app: Application) {
    app.authentication = new Authentication({
        port: 3030
    });
}
