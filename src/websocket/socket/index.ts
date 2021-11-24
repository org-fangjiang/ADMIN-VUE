import { wsUrl, wsPath } from './config';
// , wsTransports, wsQuery
import { ComponentInternalInstance } from 'vue';
// import { io, Socket } from 'socket.io-client';

// export function init(instance: ComponentInternalInstance): Socket {
//   let socket: Socket = instance?.appContext.config.globalProperties.$socket;
//   if (socket) {
//     return socket;
//   } else {
//     socket = io(wsUrl, {
//       autoConnect: true,
//       path: wsPath,
//       query: wsQuery,
//       transports: wsTransports,
//     });
//     const app = instance?.appContext;
//     if (app) {
//       app.config.globalProperties.$socket = socket;
//     }
//     return socket;
//   }
// }

export function init(instance: ComponentInternalInstance): any {
  const ws = new WebSocket(wsUrl + wsPath + '/');
  // ws.onopen = function () {
  //   //連線(onopen)
  //   console.log('websocket connected!!');
  // };
  // ws.onmessage = function (msg) {
  //   //監聽訊息(onmessage)
  //   console.log('onmessage', msg);
  // };
  ws.onerror = function (err) {
    //監聽錯誤(onerror)
    console.log('error', err);
  };
  const app = instance?.appContext;
  if (app) {
    app.config.globalProperties.$socket = ws;
  }
  return ws;
}
