import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthServiceService } from './auth.service';
import { AuthController } from './auth.controller';
import { Roles } from './roles.decorator';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  providers: [AuthServiceService],
  controllers: [AuthController],
  exports: [Roles],
})
export class AuthModule {}
