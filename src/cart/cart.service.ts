import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity.js';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity.js';
import { Product } from '../products/entities/product.entity.js';

import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { NotFoundException } from '@nestjs/common';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,

        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async addToCart(
        userId: number,
        addToCartDto: AddToCartDto,
    ) {
        const { productId, quantity } = addToCartDto;

        // ata te check product hobe
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

        // ata check korbe stock ache ki nah
        if (product.stock < quantity) {
            throw new NotFoundException(
                'Insufficient product stock',
            );
        }

        //  khujbe user cart
        let cart = await this.cartRepository.findOne({
            where: {
                user: {
                    id: userId,
                },
            },
        });


        if (!cart) {
            cart = this.cartRepository.create({
                user: {
                    id: userId,
                },
            });

            cart = await this.cartRepository.save(cart);
        }

        // jodi product aga theke cart thake seta dekbe
        let cartItem = await this.cartItemRepository.findOne({
            where: {
                cart: {
                    id: cart.id,
                },
                product: {
                    id: productId,
                },
            },
            relations: {
                cart: true,
                product: true,
            },
        });

        // jodi card a thake incress krbe
        if (cartItem) {
            const newQuantity =
                cartItem.quantity + quantity;

            if (newQuantity > product.stock) {
                throw new NotFoundException(
                    'Insufficient product stock',
                );
            }

            cartItem.quantity = newQuantity;

            return this.cartItemRepository.save(cartItem);
        }

        // na thakle new toba add hobe
        cartItem = this.cartItemRepository.create({
            cart,
            product,
            quantity,
        });

        return this.cartItemRepository.save(cartItem);
    }

    async getMyCart(userId: number) {
        const cart = await this.cartRepository.findOne({
            where: {
                user: {
                    id: userId,
                },
            },
            relations: {
                user: true,
                items: {
                    product: true,
                },
            },
        });

        if (!cart) {
            return {
                message: 'Cart is empty',
                items: [],
            };
        }

        return {
            id: cart.id,
            items: cart.items.map((item) => ({
                id: item.id,
                quantity: item.quantity,
                product: item.product,
            })),
        };
    }

    async updateCartItem(
        userId: number,
        itemId: number,
        updateCartItemDto: UpdateCartItemDto,
    ) {
        const { quantity } = updateCartItemDto;

        const cartItem = await this.cartItemRepository.findOne({
            where: {
                id: itemId,
                cart: {
                    user: {
                        id: userId,
                    },
                },
            },
            relations: {
                cart: true,
                product: true,
            },
        });

        if (!cartItem) {
            throw new NotFoundException(
                'Cart item not found',
            );
        }

        if (quantity > cartItem.product.stock) {
            throw new NotFoundException(
                'Insufficient product stock',
            );
        }

        cartItem.quantity = quantity;

        return this.cartItemRepository.save(cartItem);
    }

    // cart items remove korar jonno

    async removeCartItem(
        userId: number,
        itemId: number,
    ) {
        const cartItem = await this.cartItemRepository.findOne({
            where: {
                id: itemId,
                cart: {
                    user: {
                        id: userId,
                    },
                },
            },
            relations: {
                cart: true,
            },
        });

        if (!cartItem) {
            throw new NotFoundException(
                'Cart item not found',
            );
        }

        await this.cartItemRepository.remove(cartItem);

        return {
            message: 'Cart item removed successfully',
        };
    }

}