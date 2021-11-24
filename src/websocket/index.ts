import type { App } from 'vue';
import socket from './socket/setupSocket';

export function setupWebsocket(app: App<Element>) {
  app.use(socket);
}
