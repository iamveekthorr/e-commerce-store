import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '~/auth/guards/auth.guard';
import { CurrentUser } from '~/auth/decorators/current-user.decorator';
import { Roles } from '~/auth/decorators/roles.decorator';
import { Role } from '~/auth/role.enum';
import { RolesGuard } from '~/auth/guards/role.guard';
import { User } from '~/users/schema/users.schema';

import { StoreService } from '../service/store.service';
import { CreateStoreDTO } from '../dto/create-store.dto';
import { UpdateStoreDTO } from '../dto/update-store.dto';

@Controller('stores')
export class StoreController {
    constructor(private readonly storeService: StoreService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    async createStore(
        @Body() createStoreDTO: CreateStoreDTO,
        @CurrentUser() user: User
    ) {
        return this.storeService.createStore(user.id, createStoreDTO);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER, Role.RETAIL_ADMIN)
    async getMyStore(@CurrentUser() user: User) {
        return this.storeService.getMyStores(user.id);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    async getAllStores() {
        return this.storeService.getAllStores();
    }

    @Put(':storeId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER)
    async updateMyStore(
        @CurrentUser() user: User,
        @Body() updateStore: UpdateStoreDTO,
        @Param('storeId') storeId: string,
    ) {
        return this.storeService.updateMyStore(user.id, storeId, updateStore);
    }

    @Delete(':storeId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USER)
    async deleteMyStore(
        @CurrentUser() user: User,
        @Param('storeId') storeId: string,
    ) {
        return this.storeService.deleteMyStore(user.id, storeId);
    }
}
