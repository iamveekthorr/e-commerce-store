import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';

import { AuthDTO } from './dto/auth.dto';
import { RegistrationDTO } from './dto/registration.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() authDTO: AuthDTO) {
    return this.authService.login(authDTO);
  }

  @Post('create-account')
  register(@Body() registrationDTO: RegistrationDTO) {
    return this.authService.register(registrationDTO);
  }
}
