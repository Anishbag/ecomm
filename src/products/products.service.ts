import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto.js';
import { CloudinaryService } from '../config/cloudinary.service.js';
import { Express } from 'express';
import { NotFoundException } from '@nestjs/common';


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

    async findAll() {
        return this.productRepository.find({
            where: {
                isActive: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });
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
}
