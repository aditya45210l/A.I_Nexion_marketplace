import { createAuthVerifyMessageWithJWT } from "@erc7824/nitrolite";

// filepath: src/lib/websocket.ts
export type WsStatus = "Connecting" | "Connected" | "Disconnected";

type StatusListener = (status: WsStatus) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MessageListener = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  public status: WsStatus = "Disconnected";
  private statusListeners: Set<StatusListener> = new Set();
  private messageListeners: Set<MessageListener> = new Set();
  private messageQueue: string[] = [];
  private requestId = 1;
  private manualClose = false; // 👈 added to track user-initiated close

  // 🔑 reconnect tracking
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private baseReconnectDelay = 2000; // 2s

  public connect() {
    if (this.socket && this.socket.readyState < 2) {

      console.log("socket: ",this.socket)
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_NITROLITE_WS_URL;
    if (!wsUrl) {
      console.error("NEXT_PUBLIC_NITROLITE_WS_URL is not set");
      this.updateStatus("Disconnected");
      return;
    }
    this.manualClose = false; // reset on new connect
    this.updateStatus("Connecting");
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log("✅ WebSocket Connected");
      this.updateStatus("Connected");

      const jwtToken = localStorage.getItem("your_app_name_jwt_token");
      if (jwtToken) {
        createAuthVerifyMessageWithJWT(jwtToken).then((payload) => {
          webSocketService.send(payload);
        });
      }

      // reset reconnect attempts on successful connection
      this.reconnectAttempts = 0;

      // send any queued messages
      this.messageQueue.forEach((msg) => this.socket?.send(msg));
      this.messageQueue = [];
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.messageListeners.forEach((listener) => listener(data));
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    this.socket.onclose = () => {
      console.warn("⚠️ WebSocket closed");
      this.updateStatus("Disconnected");

      // ✅ only auto-reconnect if not a manual close
      if (!this.manualClose) {
        this.attemptReconnect();
      }
    };

    this.socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      this.updateStatus("Disconnected");

      // ✅ skip reconnect if manually closed
      if (!this.manualClose) {
        this.attemptReconnect();
      }
    };
  }
  public disconnect() {
    this.manualClose = true;
    if (this.socket && this.socket.readyState <= 1) {
      this.socket.close(1000, "Manual disconnect");
    }
    this.updateStatus("Disconnected");
  }

  public send(payload: string) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(payload);
    } else {
      this.messageQueue.push(payload);
    }
  }

  private updateStatus(newStatus: WsStatus) {
    this.status = newStatus;
    this.statusListeners.forEach((listener) => listener(this.status));
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("❌ Max reconnect attempts reached. Giving up.");
      return;
    }

    this.reconnectAttempts++;
    const delay =
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `🔄 Attempting reconnect in ${delay}ms (try ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  public addStatusListener(listener: StatusListener) {
    this.statusListeners.add(listener);
    listener(this.status);
  }

  public removeStatusListener(listener: StatusListener) {
    this.statusListeners.delete(listener);
  }

  public addMessageListener(listener: MessageListener) {
    this.messageListeners.add(listener);
  }

  public removeMessageListener(listener: MessageListener) {
    this.messageListeners.delete(listener);
  }
}

export const webSocketService = new WebSocketService();
