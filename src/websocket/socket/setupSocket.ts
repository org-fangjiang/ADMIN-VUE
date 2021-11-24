import { Socket } from 'dgram';
// import io from 'socket.io-client';

export default {
  install(app): void {
    const socket: Socket | undefined = undefined;
    app.config.globalProperties.$socket = socket;
  },
};
