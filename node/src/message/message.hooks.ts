import _ from 'lodash';
import { mikudos } from 'mikudos-socketio-app';
// Don't remove this comment. It's needed to format import lines nicely.

export default {
    all: [(data: any, socket: mikudos.Socket) => {}],
    chat: [
        async (data: any, socket: mikudos.Socket) => {
            console.log('TCL: socket chat');
            let rooms = await socket.mikudos.app.clientRooms(socket);
            console.log('rooms', rooms);
        }
    ],
    join: [(data: any, socket: mikudos.Socket) => {}],
    leave: [(data: any, socket: mikudos.Socket) => {}]
};
