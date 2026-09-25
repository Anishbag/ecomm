import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto.js';


@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    ) { }

    async create(
        createProductDto: CreateProductDto,
    ) {
        const {
            name,
            sku,
            category,
            description,
            price,
            discountPrice,
            stock,
            images,
            sizes,
            colors,
        } = createProductDto;

        const existingProduct =
            await this.productRepository.findOne({
                where: {
                    sku,
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
                images: images ?? null,
                sizes: sizes ?? null,
                colors: colors ?? null,
                isActive: true,
            });

        return this.productRepository.save(product);
    }
}
