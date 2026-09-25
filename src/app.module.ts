import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { DatabaseModule } from './database/database.module.js';
import { ProductsController } from './products/products.controller.js';
import { ProductsModule } from './products/products.module.js';


@Module({
  imports: [ConfigModule.forRoot({ 
    isGlobal: true ,
  }),

  TypeOrmModule.forRootAsync({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory: (configService: ConfigService) => ({
      type:'mysql',
      host:configService.get<string>('DB_HOST'),

      port:Number(configService.get<string>('DB_PORT')),

      username:configService.get<string>('DB_USERNAME'),

      password:configService.get<string>('DB_PASSWORD'),

      database:configService.get<string>('DB_DATABASE'),

      ssl:{rejectUnauthorized:false},
      autoLoadEntities: true,
      synchronize:true,
      logging:true,
    }),
  }),

  UsersModule,

  AuthModule,

  DatabaseModule,

  ProductsModule,

 

],
  controllers: [AppController, ProductsController],
  providers: [AppService],
})
export class AppModule {}
