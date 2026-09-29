import { Module } from '@nestjs/common';
import { CartController } from './cart.controller.js';
import { CartService } from './cart.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity.js';
import { CartItem } from './entities/cart-item.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({

  imports: [TypeOrmModule.forFeature([
    Cart,
    CartItem,
    Product,
  ]),

  AuthModule,
  
],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
