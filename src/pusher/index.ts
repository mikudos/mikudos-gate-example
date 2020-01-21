import { Application, PUSHER_HANDLER } from 'mikudos-socketio-app';
import pusher from './pusher';

export default function(app: Application) {
  app.pusher = new PUSHER_HANDLER(app, {}, pusher(app));
}
