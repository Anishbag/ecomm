import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import type { Relation } from 'typeorm';

import { User } from '../../users/entities/user.entity.js';
import { CartItem } from './cart-item.entity.js';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Relation<User>;

  @OneToMany(
    () => CartItem,
    (cartItem) => cartItem.cart,
    {
      cascade: true,
    },
  )
  items: Relation<CartItem[]>;
}