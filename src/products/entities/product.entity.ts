import {Column,CreateDateColumn,Entity,PrimaryGeneratedColumn,UpdateDateColumn,} from 'typeorm';

export enum ProductCategory {
  SOFAS = 'SOFAS',
  CHAIRS = 'CHAIRS',
  TABLES = 'TABLES',
  BEDS = 'BEDS',
  STORAGE = 'STORAGE',
  LIGHTING = 'LIGHTING',
  DECOR = 'DECOR',
  OTHER = 'OTHER',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ unique: true, length: 50 })
  sku: string;

  @Column({
    type: 'enum',
    enum: ProductCategory,
  })
  category: ProductCategory;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  price: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  discountPrice: number | null;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({
    type: 'json',
    nullable: true,
  })
  images: string[] | null;

  @Column({
    type: 'json',
    nullable: true,
  })
  sizes: string[] | null;

  @Column({
    type: 'json',
    nullable: true,
  })
  colors: string[] | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}