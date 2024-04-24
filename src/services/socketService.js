import io from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io("http://localhost:5000", {
      withCredentials: true,
      auth: {
        token,
      },
    });

    // Define all your event listeners here
    this.socket.on("connect", () => console.log("Socket connected"));
    // Add more event listeners...
  }

  disconnect() {
    if (this.socket) {
      // Remove listeners before disconnecting
      this.removeListeners();
      this.socket.disconnect();
      this.socket = null; // Ensure to reset the socket to null after disconnection
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  setupListeners(onMessageReceived, onUsersUpdated) {
    console.log("setupListeners");
    if (this.socket) {
      console.log("this.socket");
      this.socket.on("chat message", onMessageReceived);
      this.socket.on("online users", onUsersUpdated);
    }
  }

  removeListeners() {
    if (this.socket) {
      this.socket.off("chat message");
      this.socket.off("online users");
    }
  }

  isConnected() {
    return this.socket && this.socket.connected;
  }

  // Add more methods as needed...
}

const socketService = new SocketService();

export default socketService;
