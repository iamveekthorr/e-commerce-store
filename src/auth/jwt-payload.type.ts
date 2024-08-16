import { Role } from './role.enum';

export type JWTPayload = {
  // make sub userId
  sub: string;
  roles: Role[];
};
