import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './entities/user.entity';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { MessagesModule } from './modules/messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'cod_in',
      entities: [User, Message, Conversation],
      synchronize: true,
      migrationsTableName: 'typeorm_migrations',
      migrationsRun: true,
    }),
    UserModule,
    AuthModule,
    MessagesModule,
  ],
})
export class AppModule {}
