import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

import { Cart } from './cart.entity.js';
import { Product } from '../../products/entities/product.entity.js';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(
    () => Cart,
    (cart) => cart.items,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  cart: Relation<Cart>;

  @ManyToOne(
    () => Product,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  product: Relation<Product>;
}