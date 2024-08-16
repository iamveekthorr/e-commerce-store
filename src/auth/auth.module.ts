import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthServiceService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '~/users/schema/users.schema';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthServiceService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
