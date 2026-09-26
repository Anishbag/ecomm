import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service.js';
import { Product } from './entities/product.entity.js';
import { ProductsController } from './products.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { AppConfigModule } from '../config/config.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), AuthModule, AppConfigModule],

  controllers: [ProductsController],

  providers: [ProductsService],

  exports: [ProductsService],
})
export class ProductsModule {}
