import { Entity, PrimaryGeneratedColumn , ManyToOne, JoinColumn, Unique} from "typeorm";
import { User } from '../../users/entities/user.entity.js';
import { Product } from '../../products/entities/product.entity.js';


@Entity('wishlists')
@Unique(['user', 'product'])
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  product: Product;
}

