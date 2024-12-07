import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, (user) => user.conversations)
  users: User[];

  @Column('simple-json', { array: true })
  participants: number[];

  @OneToMany(() => Message, (message) => message.conversation)
  @JoinTable({ name: 'user_id' })
  messages: Message[];
}
