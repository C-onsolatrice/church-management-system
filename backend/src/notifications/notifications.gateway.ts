import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from "@nestjs/websockets";
  import { Server, Socket } from "socket.io";
  
  @WebSocketGateway({
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
    transports: ["websocket"],
  })
  export class NotificationsGateway {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      console.log(`Socket connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Socket disconnected: ${client.id}`);
    }
  
    @SubscribeMessage("notification")
    handleNotification(
      @MessageBody() data: unknown,
      @ConnectedSocket() client: Socket,
    ) {
      client.emit("notification", data);
    }
  
    sendNotification(data: unknown) {
      this.server.emit("notification", data);
    }
  }