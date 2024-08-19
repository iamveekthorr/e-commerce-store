import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '~/users/schema/users.schema';
import { UserService } from '~/users/users.service';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtAuthGuard } from './guards/auth.guard';

import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    JwtAuthGuard,
    UserService,
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
