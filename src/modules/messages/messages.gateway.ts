import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001, { transports: ['websocket'] })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private activeUsers: Set<string> = new Set();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.activeUsers.delete(client.id);
    this.server.emit('users', Array.from(this.activeUsers));
  }

  @SubscribeMessage('message')
  handleMessage(
    client: Socket,
    payload: { sender: string; message: string },
  ): void {
    console.info(`Message received: ${payload.message} from ${payload.sender}`);
    this.server.emit('message', payload);
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, username: string): void {
    console.log(`${username} joined with ID: ${client.id}`);
    this.activeUsers.add(username);
    this.server.emit('users', Array.from(this.activeUsers));
  }
}
