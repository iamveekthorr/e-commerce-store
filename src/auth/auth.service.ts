import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './jwt-payload.type';

@Injectable()
export class AuthServiceService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async generateTokens(auth: JWTPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(auth, {
        expiresIn: 60 * 60 * 24,
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      }),
      this.jwtService.signAsync(auth, {
        // Access token will expire in 1week
        expiresIn: 60 * 60 * 24 * 7,
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
