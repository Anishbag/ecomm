import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity.js';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity.js';


@Injectable()
export class WishlistService {
    constructor(
        @InjectRepository(Wishlist)
        private readonly wishlistRepository: Repository<Wishlist>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async addToWishlist(
        userId: number,
        productId: number,
    ) {
        const product = await this.productRepository.findOne({
            where: {
                id: productId,
                isActive: true,
            },
        });

        if (!product) {
            throw new NotFoundException(
                'Product not found or inactive',
            );
        }

        const existingWishlist =
            await this.wishlistRepository.findOne({
                where: {
                    user: {
                        id: userId,
                    },
                    product: {
                        id: productId,
                    },
                },
            });

        if (existingWishlist) {
            throw new ConflictException(
                'Product already exists in wishlist',
            );
        }

        const wishlist =
            this.wishlistRepository.create({
                user: {
                    id: userId,
                },
                product,
            });

        return this.wishlistRepository.save(wishlist);
    }


    async getMyWishlist(userId: number) {
        const wishlist = await this.wishlistRepository.find({
            where: {
                user: {
                    id: userId
                },
            },
            relations: {
                product: true,
            },
            order: {
                id: 'DESC'
            },
        });
        return {
            items: wishlist.map((item) => ({
                id: item.id,
                product: item.product,
            })),
        };
    }


    async removeFromWishlist(userId: number, productId: number) {
        const wishlist = await this.wishlistRepository.findOne({
            where: {
                user: { id: userId },
                product: { id: productId },
            },
        });

        if (!wishlist) {
            throw new NotFoundException('Product not found in wishlist');
        }

        await this.wishlistRepository.remove(wishlist);

        return {
            message: 'Product removed from wishlist successfully',
        };
    }
}
