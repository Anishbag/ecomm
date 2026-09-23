import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports:[TypeOrmModule.forFeature([User])],

  controllers: [AuthController],
  providers: [AuthService],

  exports: [AuthService],
})
export class AuthModule {}
