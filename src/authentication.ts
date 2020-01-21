import {
  Application,
  Authentication,
  AuthenticationRequest,
  mikudos,
} from 'mikudos-socketio-app';
import { pull } from 'lodash';

async function authJoinCallback(socket: mikudos.Socket, app?: Application) {
  if (app) {
    let userId = (socket as any).mikudos.user[
      app.get('authentication.entityId') || 'id'
    ];
    app.io.in(userId).clients((err: any, clients: string[]) => {
      pull(clients, socket.id);
      let close = true;
      clients.map(id => {
        if (app.io.sockets[id]) app.io.sockets[id].disconnect(close);
        if (app.enabled('redisAdaptered')) {
          app.remoteDisconnect(id, close);
        }
      });
    });
  }
}

class MyAuthentication extends Authentication {
  async authenticate(body: AuthenticationRequest) {
    let option = { body, ...this.requsetOption };
    return {
      accessToken: 'test token',
      user: {
        id: 21,
        username: 'testuser',
      },
    };
  }
}

export default function(app: Application) {
  app.authentication = new MyAuthentication(
    app,
    {
      ...app.get('authentication.request'),
    },
    { authJoinCallback: authJoinCallback },
  );
}
