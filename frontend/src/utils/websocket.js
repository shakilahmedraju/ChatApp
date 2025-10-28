const API_BASE = import.meta.env.VITE_API_BASE_URL
class WebSocketService {
  constructor() {
    this.socket = null;
    this.messageHandlers = new Set();
    this.connectionHandlers = new Set();
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    // this.socket = new WebSocket(`ws://localhost:8000/ws?token=${token}`);
    this.socket = new WebSocket(`${API_BASE.replace(/^http/, 'ws')}/ws?token=${token}`);

    this.socket.onopen = () => {
      console.log('WebSocket connected');
      this.connectionHandlers.forEach(handler => handler(true));
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
      console.log('WebSocket disconnected');
      this.connectionHandlers.forEach(handler => handler(false));
      this.socket = null;
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
      return true;
    }
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