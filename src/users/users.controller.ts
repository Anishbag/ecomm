import {Controller,Get,Req,UseGuards,} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UsersService } from './users.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from './entities/user.entity.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    email: string;
    role: string;
  };
}



@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: AuthenticatedRequest,) {
    const user = await this.usersService.getProfile(
        req.user.userId,
    );

    return{
        message:'User profile fetched successfully',
        data: user
    }
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin-test')
  adminTest(){
    return{
      message:'Admin test passed'
    }
  }
}
