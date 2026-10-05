import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity.js';
import { WishlistController } from './wishlist.controller.js';
import { Product } from '../products/entities/product.entity.js';
import { AuthModule } from '../auth/auth.module.js';


@Module({
  imports:[TypeOrmModule.forFeature([Wishlist,Product]),

  AuthModule,

],
  controllers:[WishlistController],

  
  providers: [WishlistService],
})
export class WishlistModule {}
