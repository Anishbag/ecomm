import {
    Body,
    Controller,
    HttpStatus,
    Post,
    UseGuards,
    Req,
    HttpCode,
    Get,
    Param,
    Patch,
} from '@nestjs/common';
import { CartService } from './cart.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AuthUser } from '../auth/types/auth-user.type.js';
import { AddToCartDto } from './dto/add-to-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';



@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async addToCart(
        @Req() req: Request & {user:AuthUser},
        @Body() addToCartDto: AddToCartDto,
        
    ) {
        return this.cartService.addToCart(
            req.user.userId,
            addToCartDto,
        );
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getMyCart(
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.cartService.getMyCart(req.user.userId);
    }

    @Patch(':itemId')
    @UseGuards(JwtAuthGuard)
    async updateCartItem(
        @Req() req: Request & { user: AuthUser },
        @Param('itemId') itemId: string,
        @Body() updateCartItemDto: UpdateCartItemDto,
    ) {
        return this.cartService.updateCartItem(
            req.user.userId,
            Number(itemId),
            updateCartItemDto,
        );
    }

}
