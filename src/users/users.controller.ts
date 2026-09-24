import {Controller,Get,Req,UseGuards,} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UsersService } from './users.service.js';

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
}
