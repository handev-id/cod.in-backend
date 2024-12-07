import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from 'src/dtos/messages/create-message.dto';
import { Conversation } from 'src/entities/conversation.entity';
import { Message } from 'src/entities/message.entity';
import { Raw, Repository } from 'typeorm';

export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async store(data: CreateMessageDto): Promise<Message> {
    let conversation = await this.conversationRepository.findOne({
      where: {
        participants: Raw(
          (alias) =>
            `JSON_CONTAINS(${alias}, '[${data.sender_id}, ${data.receiver_id}]')`,
        ),
      },
    });

    if (!conversation) {
      conversation = this.conversationRepository.create({
        participants: [data.sender_id, data.receiver_id],
      });
      conversation = await this.conversationRepository.save(conversation);
    }

    const message = this.messageRepository.create({
      content: data.content,
      sender: { id: data.sender_id },
      conversation: conversation,
    });
    const savedMessage = await this.messageRepository.save(message);

    return savedMessage;
  }
}
