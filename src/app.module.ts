import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoreModule } from './store/store.module';
import { ConfigModule } from '@nestjs/config';

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
