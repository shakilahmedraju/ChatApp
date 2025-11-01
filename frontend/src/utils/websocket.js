// const API_BASE = import.meta.env.VITE_API_BASE_URL
// class WebSocketService {
//   constructor() {
//     this.socket = null;
//     this.messageHandlers = new Set();
//     this.connectionHandlers = new Set();
//   }

//   connect(token) {
//     if (this.socket) {
//       this.disconnect();
//     }

//     // this.socket = new WebSocket(`ws://localhost:8000/ws?token=${token}`);
//     this.socket = new WebSocket(`${API_BASE.replace(/^http/, 'ws')}/ws?token=${token}`);

//     this.socket.onopen = () => {
//       console.log('WebSocket connected');
//       this.connectionHandlers.forEach(handler => handler(true));
//     };

//     this.socket.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         this.messageHandlers.forEach(handler => handler(data));
//       } catch (error) {
//         console.error('Error parsing WebSocket message:', error);
//       }
//     };

//     this.socket.onclose = () => {
//       console.log('WebSocket disconnected');
//       this.connectionHandlers.forEach(handler => handler(false));
//       this.socket = null;
//     };

//     this.socket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };
//   }

//   disconnect() {
//     if (this.socket) {
//       this.socket.close();
//       this.socket = null;
//     }
//   }

//   sendMessage(message) {
//     if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//       this.socket.send(JSON.stringify(message));
//       return true;
//     }
//     return false;
//   }

//   addMessageHandler(handler) {
//     this.messageHandlers.add(handler);
//   }

//   removeMessageHandler(handler) {
//     this.messageHandlers.delete(handler);
//   }

//   addConnectionHandler(handler) {
//     this.connectionHandlers.add(handler);
//   }

//   removeConnectionHandler(handler) {
//     this.connectionHandlers.delete(handler);
//   }

//   isConnected() {
//     return this.socket && this.socket.readyState === WebSocket.OPEN;
//   }
// }

// export const webSocketService = new WebSocketService();




// utils/websocket.js
const API_BASE = import.meta.env.VITE_API_BASE_URL;

class WebSocketService {
  constructor() {
    this.socket = null;
    this.messageHandlers = new Set();
    this.connectionHandlers = new Set();
    this.connected = false;
    this.connectPromise = null; // ✅ track connection readiness
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    const wsUrl = `${API_BASE.replace(/^http/, 'ws')}/ws?token=${token}`;
    this.socket = new WebSocket(wsUrl);

    this.connectPromise = new Promise((resolve, reject) => {
      this.socket.onopen = () => {
        console.log('✅ WebSocket connected');
        this.connected = true;
        this.connectionHandlers.forEach(handler => handler(true));
        resolve(true);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.messageHandlers.forEach(handler => handler(data));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('❌ WebSocket disconnected');
        this.connected = false;
        this.connectionHandlers.forEach(handler => handler(false));
        this.socket = null;
      };

      this.socket.onerror = (error) => {
        console.error('⚠️ WebSocket error:', error);
        this.connected = false;
        reject(error);
      };
    });

    return this.connectPromise;
  }

  async waitUntilConnected(timeout = 4000) {
    if (this.isConnected()) return true;
    if (!this.connectPromise) throw new Error('WebSocket not initialized');

    return Promise.race([
      this.connectPromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('WebSocket connection timeout')), timeout)
      ),
    ]);
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connected = false;
    }
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
      return true;
    }
    console.warn('⚠️ Tried to send message but socket not open');
    return false;
  }

  addMessageHandler(handler) {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler) {
    this.messageHandlers.delete(handler);
  }

  addConnectionHandler(handler) {
    this.connectionHandlers.add(handler);
  }

  removeConnectionHandler(handler) {
    this.connectionHandlers.delete(handler);
  }

  isConnected() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }
}

export const webSocketService = new WebSocketService();
