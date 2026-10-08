import { Module } from '@nestjs/common';
import { OrderService } from './order.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
@Module({
  imports: [TypeOrmModule.forFeature([
    Order, 
    OrderItem]),
],
  providers: [OrderService],
})
export class OrderModule { }
