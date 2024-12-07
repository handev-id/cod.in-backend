import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.servce';
import { Message } from 'src/entities/message.entity';

@WebSocketGateway(3002, { cors: { origin: '*' } })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private activeUsers: Set<string> = new Set();

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.activeUsers.delete(client.id);
    this.server.emit('users', Array.from(this.activeUsers));
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: {
      sender_id: number;
      message: string;
      conversation_id: number;
      receiver_id: number; // ( INI ID DATABASE )
    },
  ) {
    try {
      // const savedMessage: Message = await this.messagesService.store({
      //   content: payload.message,
      //   sender_id: payload.sender_id,
      //   receiver_id: payload.receiver_id,
      //   conversation_id: payload.conversation_id,
      // });

      console.log(payload);
      this.server
        .to(payload.receiver_id.toString()) // ( APAKAH BENAR DIMASUKKAN KESINI )
        .emit('message', payload.message);

      return { event: 'message', data: payload };
    } catch (error) {
      console.error('ERROR GATEWAY - SOCKET: ', error);
      throw error;
    }
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, username: string): void {
    console.log(`${username} joined with ID: ${client.id}`);
    this.activeUsers.add(username);
    this.server.emit('users', Array.from(this.activeUsers));
  }
}
