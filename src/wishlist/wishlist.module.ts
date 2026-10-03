import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity.js';
import { WishlistController } from './wishlist.controller.js';

@Module({
  imports:[TypeOrmModule.forFeature([Wishlist])],
  controllers:[WishlistController],

  
  providers: [WishlistService]
})
export class WishlistModule {}
