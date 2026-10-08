import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Order } from './order.entity.js';
import { Product } from '../../products/entities/product.entity.js';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(() => Order, (order) => order.items, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    order: Relation<Order>;


    @ManyToOne(() => Product, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    product: Relation<Product>;


    @Column({ length: 150 })
    productName: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    subtotal: number;
}