import { Controller, HttpCode, HttpStatus, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import type { AuthUser } from './types/auth-user.type.js';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService
    ){}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto:RegisterDto){
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body()loginDto:LoginDto){
        return this.authService.login(loginDto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body() refreshTokenDto:RefreshTokenDto,){
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(
        @Req() req: Request & { user: AuthUser },
    ) {
        return this.authService.logout(
            req.user.userId,
        );
    }

}
