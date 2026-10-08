import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AuthUser } from '../auth/types/auth-user.type.js';
import { CreateOrderDto } from './dto/create-order.dto.js';


@Controller('orders')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
    ){}

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async createOrder(
        @Req() req: Request & {user: AuthUser},
        @Body() createOrderDto: CreateOrderDto,
    ){
        return this.orderService.createOrder(
            req.user.userId,
            createOrderDto,
        );
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getMyOrders(
        @Req() req: Request & {user: AuthUser},
    ){
        return this.orderService.getMyOrders(
            req.user.userId,
        );
    }


    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getMyOrderById(
        @Req() req: Request & { user: AuthUser },
        @Param('id') id: string,
    ) {
        return this.orderService.getMyOrderById(
            req.user.userId,
            Number(id),
        );
    }
        
    


   
}
