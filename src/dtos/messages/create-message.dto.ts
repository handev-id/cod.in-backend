import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  conversation_id: number;

  @IsNotEmpty()
  @IsNumber()
  sender_id: number;

  @IsNotEmpty()
  @IsNumber()
  receiver_id: number;
}
