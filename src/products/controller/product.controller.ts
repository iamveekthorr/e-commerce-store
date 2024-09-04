import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '~/auth/guards/auth.guard';
import { RolesGuard } from '~/auth/guards/role.guard';
import { Roles } from '~/auth/decorators/roles.decorator';
import { CurrentUser } from '~/auth/decorators/current-user.decorator';
import { Role } from '~/auth/role.enum';
import { User } from '~/users/schema/users.schema';

import { ProductService } from '../service/product.service';
import { CreateProductDTO } from '../dto/create-product.dto';
import { UpdateProductDTO } from '../dto/update-product.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @Roles(Role.RETAIL_ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    createProduct(
        @Body() createProductDto: CreateProductDTO,
        @CurrentUser() user: User,
    ) {
        return this.productService.createProduct(user.id, createProductDto);
    }

    @Get()
    getAllProducts(@Query() queryString: any) {
        return this.productService.getAllProducts(queryString);
    }

    @Get(':productId')
    getProductById(@Param('productId') productId: string) {
        return this.productService.getProductById(productId);
    }

    @Get('my/:storeId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.RETAIL_ADMIN)
    getProductsInMyStore(
        @CurrentUser() user: User,
        @Param('storeId') storeId: string,
    ) {
        return this.productService.getProductsByStoreId(user.id, storeId);
    }

    @Patch()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.RETAIL_ADMIN)
    updateMyProduct(
        @CurrentUser() user: User,
        @Body() updateDto: UpdateProductDTO,
    ) {
        return this.productService.updateMyProduct(user.id, updateDto);
    }

    @Delete('my/:productId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.RETAIL_ADMIN)
    deleteMyProduct(
        @CurrentUser() user: User,
        @Param('productId') productId: string,
    ) {
        return this.productService.deleteMyProduct(user.id, productId);
    }

    @Delete(':productId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    deleteProduct(@Param('productId') productId: string) {
        return this.productService.deleteProduct(productId);
    }
}
