import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoreModule } from './store/store.module';

import { validate } from './env.validate';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    AuthModule,
    UsersModule,
    StoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
