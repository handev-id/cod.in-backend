import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { User } from './entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'cod_in',
      entities: [User],
      synchronize: true,
      migrationsTableName: 'typeorm_migrations',
      migrationsRun: true,
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
