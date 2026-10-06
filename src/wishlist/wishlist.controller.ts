import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { WishlistService } from './wishlist.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { AuthUser } from '../auth/types/auth-user.type.js';



@Controller('wishlist')
export class WishlistController {
    constructor(
        private readonly wishlistService: WishlistService,
    ) { }

    @Post(':productId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async addToWishlist(
        @Req() req: Request & { user: AuthUser },
        @Param('productId') productId: string,
    ) {
        return this.wishlistService.addToWishlist(
            req.user.userId,
            Number(productId),
        );
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getMyWishlist(
        @Req() req: Request & {user: AuthUser},
    ){
        return this.wishlistService.getMyWishlist(
            req.user.userId
        );
    }


    @Delete(':productId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async removeFromWishlist(
        @Req() req: Request & { user: AuthUser },
        @Param('productId') productId: string,
    ) {
        return this.wishlistService.removeFromWishlist(
            req.user.userId,
            Number(productId),
        );
    }
}
