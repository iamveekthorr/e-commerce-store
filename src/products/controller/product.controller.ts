import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ProductService } from "../service/product.service";
import { JwtAuthGuard } from "~/auth/guards/auth.guard";
import { RolesGuard } from "~/auth/guards/role.guard";
import { CreateProductDTO } from "../dto/create-product.dto";
import { CurrentUser } from "~/auth/decorators/current-user.decorator";
import { User } from "~/users/schema/users.schema";
import { Role } from "~/auth/role.enum";
import { Roles } from "~/auth/decorators/roles.decorator";
import { UpdateProductDTO } from "../dto/update-product.dto";


@Controller('products')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    @Roles(Role.RETAIL_ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    async createProduct(
        @Body() createProductDto: CreateProductDTO,
        @CurrentUser() user: User
    ) {
        return this.productService.createProduct(user.id, createProductDto);
    }

    @Get()
    async getAllPoducts() {
        return this.productService.getAllProducts()
    }

    @Get('my/:storeId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.RETAIL_ADMIN)
    async getProductsInMyStore(
        @CurrentUser() user: User,
        @Param('storeId') storeId: string
    ) {

        return this.productService.findProductsByStoreIDForRetailer(
            user.id,
            storeId
        );
    }

    @Patch()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.RETAIL_ADMIN)
    async updateMyProduct(
        @CurrentUser() user: User,
        @Body() updateDto: UpdateProductDTO,
    ) {
        return this.productService.updateMyProduct(
            user.id,
            updateDto
        );
    }


    @Delete(':productId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.RETAIL_ADMIN)
    async deleteMyProduct(
        @CurrentUser() user: User,
        @Param('productId') productId: string
    ) {

        return this.productService.deleteMyProduct(
            user.id,
            productId
        );
    }


    @Delete(':productId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    async deleteProduct(
        @Param('productId') productId: string
    ) {
        return this.productService.deleteProduct(
            productId
        );
    }

}