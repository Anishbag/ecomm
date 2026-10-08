import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto.js';
import { CloudinaryService } from '../config/cloudinary.service.js';
import { Express } from 'express';
import { NotFoundException } from '@nestjs/common';
import { ProductCategory } from '../common/enums/product-category.enum.js';
import { UpdateProductDto } from './dto/update-product.dto.js';


@Injectable()
export class ProductsService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository:
            Repository<Product>,

        private readonly cloudinaryService:
            CloudinaryService,
    ) { }

    async create(
        createProductDto: CreateProductDto,
        files: Express.Multer.File[],
    ) {

        const {
            name,
            sku,
            category,
            description,
            price,
            discountPrice,
            stock,
            sizes,
            colors,
        } = createProductDto;

        const existingProduct =
            await this.productRepository.findOne({
                where: {
                    sku: sku.trim().toUpperCase(),
                },
            });

        if (existingProduct) {
            throw new ConflictException(
                'Product SKU already exists',
            );
        }

        if (
            discountPrice !== undefined &&
            discountPrice >= price
        ) {
            throw new ConflictException(
                'Discount price must be less than regular price',
            );
        }

        let imageUrls: string[] = [];

        if (files && files.length > 0) {
            imageUrls = await Promise.all(
                files.map((file) =>
                    this.cloudinaryService.uploadImage(file),
                ),
            );
        }

        const product =
            this.productRepository.create({
                name: name.trim(),
                sku: sku.trim().toUpperCase(),
                category,
                description: description.trim(),
                price,
                discountPrice:
                    discountPrice ?? null,
                stock,
                images:
                    imageUrls.length > 0
                        ? imageUrls
                        : null,
                sizes: sizes ?? null,
                colors: colors ?? null,
                isActive: true,
            });

        return this.productRepository.save(product);
    }

    async findAll(
        search?: string,
        category?: ProductCategory,
        page: number = 1,
        limit: number = 10,
        sort: string = 'latest',
    ) {
        const safePage = Math.max(1, page);
        const safeLimit = Math.min(Math.max(1, limit), 50);

        const query = this.productRepository
            .createQueryBuilder('product')
            .where('product.isActive = :isActive', {
                isActive: true,
            });


        if (search) {
            query.andWhere(
                '(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search))',
                {
                    search: `%${search.trim()}%`,
                },
            );
        }


        if (category) {
            query.andWhere(
                'product.category = :category',
                {
                    category,
                },
            );
        }


        switch (sort) {
            case 'price_asc':
                query.orderBy('product.price', 'ASC');
                break;

            case 'price_desc':
                query.orderBy('product.price', 'DESC');
                break;

            case 'latest':
            default:
                query.orderBy('product.createdAt', 'DESC');
                break;
        }


        const skip = (safePage - 1) * safeLimit;

        query.skip(skip).take(safeLimit);

        const [products, total] =
            await query.getManyAndCount();

        return {
            products,
            pagination: {
                currentPage: safePage,
                limit: safeLimit,
                totalProducts: total,
                totalPages: Math.ceil(total / safeLimit),
                hasNextPage:
                    safePage < Math.ceil(total / safeLimit),
                hasPreviousPage: safePage > 1,
            },
        };
    }


    async findOne(id: number) {
        const product = await this.productRepository.findOne({
            where: {
                id,
                isActive: true,
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }


    // Admin All Products see

    async findAllForAdmin(
        page: number = 1,
        limit: number = 10,
    ) {
        const safePage = Math.max(1, page);
        const safeLimit = Math.min(
            Math.max(1, limit),
            50,
        );

        const skip = (safePage - 1) * safeLimit;

        const [products, total] =
            await this.productRepository.findAndCount({
                order: {
                    createdAt: 'DESC',
                },
                skip,
                take: safeLimit,
            });

        return {
            products,
            pagination: {
                currentPage: safePage,
                limit: safeLimit,
                totalProducts: total,
                totalPages: Math.ceil(total / safeLimit),
                hasNextPage:
                    safePage < Math.ceil(total / safeLimit),
                hasPreviousPage: safePage > 1,
            },
        };
    }


    async update(
        id: number,
        updateProductDto: UpdateProductDto,
        files: Express.Multer.File[],
    ) {
        const product =
            await this.productRepository.findOne({
                where: { id },
            });

        if (!product) {
            throw new NotFoundException(
                'Product not found',
            );
        }

        // validate price and disc

        const newPrice =
            updateProductDto.price ??
            product.price;

        const newDiscountPrice =
            updateProductDto.discountPrice ??
            product.discountPrice;

        if (
            newDiscountPrice !== null &&
            newDiscountPrice !== undefined &&
            newDiscountPrice >= newPrice
        ) {
            throw new ConflictException(
                'Discount price must be less than regular price',
            );
        }

        //    ata old image remove korbe

        if (
            updateProductDto.removeImages &&
            updateProductDto.removeImages.length > 0
        ) {
            const removeImages =
                updateProductDto.removeImages;

            //ata cloud theke img delete krbe
            await Promise.all(
                removeImages.map((imageUrl) =>
                    this.cloudinaryService.deleteImage(
                        imageUrl,
                    ),
                ),
            );

            // Remove images krbe database 
            product.images =
                (product.images ?? []).filter(
                    (imageUrl) =>
                        !removeImages.includes(imageUrl),
                );
        }

        //    new image upld krbe

        if (files && files.length > 0) {
            const newImageUrls =
                await Promise.all(
                    files.map((file) =>
                        this.cloudinaryService.uploadImage(
                            file,
                        ),
                    ),
                );

            product.images = [
                ...(product.images ?? []),
                ...newImageUrls,
            ];
        }



        const {
            removeImages,
            ...productData
        } = updateProductDto;

        Object.assign(product, productData);

        return this.productRepository.save(product);
    }


    async updateStatus(
        id: number,
        isActive: boolean,
    ) {
        const product = await this.productRepository.findOne({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        product.isActive = isActive;

        return this.productRepository.save(product);
    }







}




