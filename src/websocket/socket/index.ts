import { wsUrl } from './config';
// , wsTransports, wsQuery
import { ComponentInternalInstance } from 'vue';
// import SockJS from 'sockjs-client/dist/sockjs.min.js';
// import Stomp from 'stompjs';
import { getAccessToken } from '/@/utils/auth';
import { Client } from '@stomp/stompjs';
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

const token = getAccessToken();

// export function init(instance: ComponentInternalInstance): any {
//   const ws = new WebSocket(wsUrl + wsPath + '/');
//   // ws.onopen = function () {
//   //   //連線(onopen)
//   //   console.log('websocket connected!!');
//   // };
//   // ws.onmessage = function (msg) {
//   //   //監聽訊息(onmessage)
//   //   console.log('onmessage', msg);
//   // };
//   ws.onerror = function (err) {
//     //監聽錯誤(onerror)
//     console.log('error', err);
//   };
//   const app = instance?.appContext;
//   if (app) {
//     app.config.globalProperties.$socket = ws;
//   }
//   return ws;
// }

// export async function initWs(
//   role: string,
//   userId: string,
//   onMessage: Function,
//   instance: ComponentInternalInstance | null
// ) {
//   const socket = new SockJS('/sys-websocket/ws');
//   const stompClient = Stomp.over(socket);
//   const headers = { Authorization: `${token}` };
//   const connect = async () => {
//     console.log('stompClient connect start');
//     let result = false;
//     await stompClient.connect(
//       headers,
//       () => {
//         stompClient.subscribe(`/queue/${role}`, onMessage);
//         stompClient.subscribe(`/user/${userId}/queue`, onMessage);
//         result = true;
//       },
//       (err) => {
//         // 连接发生错误时的处理函数
//         console.log(err);
//         result = false;
//       }
//     );
//     return result;
//   };
//   const connectResult: Boolean = await connect();
//   if (connectResult) {
//     const app = instance?.appContext;
//     if (app) {
//       app.config.globalProperties.$stompClient = stompClient;
//     }
//     return true;
//   } else {
//     return false;
//   }
// }

export function initStomp(
  role: string,
  userId: string,
  onMessage: any,
  instance: ComponentInternalInstance | null
): any {
  // use @Stomp/stomp websocket remove withSockJS() in WebSocketConfig;
  let client;
  const app = instance?.appContext;
  if (app?.config.globalProperties.$stompClient) {
    client = app?.config.globalProperties.$stompClient;
  } else {
    client = new Client();
  }
  client.brokerURL = wsUrl;
  client.connectHeaders = { Authorization: `${token}` };
  client.reconnectDelay = 5000;
  client.heartbeatIncoming = 4000;
  client.heartbeatOutgoing = 4000;
  client.onConnect = function (_frame) {
    client.subscribe(`/queue/${role}`, onMessage);
    client.subscribe(`/user/${userId}/queue`, onMessage);
  };

  client.onStompError = function (frame) {
    console.log('Broker reported error: ' + frame.headers['message']);
    console.log('Additional details: ' + frame.body);
  };
  client.onWebSocketError = () => {
    console.log('STOP');
  };

  client.activate();
  if (app) {
    app.config.globalProperties.$stompClient = client;
  }

  return client;
}
