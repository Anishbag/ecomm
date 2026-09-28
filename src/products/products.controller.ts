import { Body, Controller, Get, HttpCode, HttpStatus, Post, UploadedFiles, UseGuards, UseInterceptors, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UserRole } from '../users/entities/user.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductCategory } from './entities/product.entity.js';


@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
    ) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(
        FilesInterceptor('images', 10)
    )
    async create(
        @Body() createProductDto: CreateProductDto,

        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return this.productsService.create(createProductDto, files,);
    }


    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Query('search') search?: string,

        @Query('category')
        category?: ProductCategory,

        @Query('page')
        page?: string,

        @Query('limit')
        limit?: string,

        @Query('sort')
        sort?: string,
    ) {
        return this.productsService.findAll(
            search,
            category,
            Number(page) || 1,
            Number(limit) || 10,
            sort || 'latest',
        );
    }



     // Admin All Products see Api ata

    @Get('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    async findAllForAdmin(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.productsService.findAllForAdmin(
            Number(page) || 1,
            Number(limit) || 10,
        );
  
    }




    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id') id: string) {
        return this.productsService.findOne(Number(id));
    }


   





}
