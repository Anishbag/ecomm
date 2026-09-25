import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity.js';
import { AdminSeedService } from './admin-seed.service.js';

@Module({
    imports:[
        TypeOrmModule.forFeature([User]),
    ],
    providers:[AdminSeedService],
    
})
export class DatabaseModule {}
