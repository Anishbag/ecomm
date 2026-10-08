import { Module } from '@nestjs/common';
import { OrderService } from './order.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { Cart } from '../cart/entities/cart.entity.js';
import { CartItem } from '../cart/entities/cart-item.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { OrderController } from './order.controller.js';
@Module({
  imports: [TypeOrmModule.forFeature([
    Order, 
    OrderItem,
    Cart,
    CartItem,
    Product
  ]),
  AuthModule,
],
  controllers:[OrderController],
  providers: [OrderService],
})
export class OrderModule { }
