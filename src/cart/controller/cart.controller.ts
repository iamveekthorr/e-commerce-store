import { Controller, Post, Get, Body, UseGuards, Patch, Delete, Param } from '@nestjs/common';

import { User } from '~/users/schema/users.schema';
import { JwtAuthGuard } from '~/auth/guards/auth.guard';
import { CurrentUser } from '~/auth/decorators/current-user.decorator';
import { Role } from '~/auth/role.enum';
import { Roles } from '~/auth/decorators/roles.decorator';
import { RolesGuard } from '~/auth/guards/role.guard';

import { AddToCartDto } from '../dto/addToCart.dto';
import { CartService } from '../service/cart.service';

@Controller('carts')
@Roles(Role.USER)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Post()
    async addToCart(
        @Body() addToCartDto: AddToCartDto,
        @CurrentUser() user: User
    ) {
        return this.cartService.addToCart(user.id, addToCartDto);
    }

    @Get()
    async getUserCart(@CurrentUser() user: User) {
        return this.cartService.getCart(user.id);
    }

    @Delete(':productId')
    async removeFromCart(
        @Param('productId') productId: string,
        @CurrentUser() user: User
    ) {
        return this.cartService.removeFromCart(user.id, productId);
    }
}
