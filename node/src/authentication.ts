import { Application, Authentication } from 'mikudos-socketio-app';
import { pull } from 'lodash';

async function authJoinCallback(socket: SocketIO.Socket, app?: Application) {
    if (app) {
        let userId = (socket as any).mikudos.user[
            app.get('authentication.entityId') || 'id'
        ];
        app.io.in(userId).clients((err: any, clients: string[]) => {
            let doubleLoginClients = pull(clients, socket.id);
            let close = true;
            clients.map(id => {
                (app.io.sockets as { [key: string]: SocketIO.Socket })[
                    id
                ].disconnect(close);
                if (app.enabled('redisAdaptered')) {
                    app.remoteDisconnect(id, close);
                }
            });
        });
    }
}

export default function(app: Application) {
    app.authentication = new Authentication(
        {
            ...app.get('authentication.request')
        },
        { authJoinCallback: authJoinCallback }
    );
}
