import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '~/auth/guards/auth.guard';
import { RolesGuard } from '~/auth/guards/role.guard';
import { Role } from '~/auth/role.enum';
import { Roles } from '~/auth/decorators/roles.decorator';
import { CurrentUser } from '~/auth/decorators/current-user.decorator';

import { UserService } from './users.service';
import { User } from './schema/users.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  getCurrentProfile(@CurrentUser() user: User) {
    return this.userService.getUserById(user.id);
  }

  @Get('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.SUPER_ADMIN)
  getAllUsers(@Query() queryString: any) {
    return this.userService.getAllUsers(queryString);
  }
}
