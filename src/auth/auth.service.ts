import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../users/entities/user.entity.js';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto.js';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto.js';
import { UnauthorizedException } from '@nestjs/common';




@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }
    async register(registerDto: RegisterDto) {
        const { name, email, password, phone } = registerDto;

        const normalizeEmail = email.trim().toLowerCase();

        const existingUser = await this.userRepository.findOne({
            where: {
                email: normalizeEmail,
            },
        });

        if (existingUser) {
            throw new ConflictException("Email is already registered",);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = this.userRepository.create({
            name: name.trim(),
            email: normalizeEmail,
            password: hashedPassword,
            phone,
            role: UserRole.USER,
            isActive: true,

        });

        const savedUser = await this.userRepository.save(user);

        const {
            password: _password,
            refreshToken: _refreshToken,
            ...safeUser
        } = savedUser;
        return {
            message: 'User registered successfully',
            user: safeUser,
        }
    }

    async login(loginDto:LoginDto){
        const{email, password} = loginDto;

        const normalizeEmail = email.trim().toLowerCase();

        const user = await this.userRepository.findOne({
            where:{
                email: normalizeEmail,
            },
        });

        if(!user){
            throw new UnauthorizedException('Invalid email or password');
        }

        if(!user.isActive){
            throw new UnauthorizedException('Your account has been deactivated');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid email or password');
        }
        const payload={
            sub:user.id,
            email:user.email,
            role:user.role,
        };
        const accessToken = await this.jwtService.signAsync(payload);

        const refreshToken = await  this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);
        user.refreshToken = hashedRefreshToken;
        await this.userRepository.save(user);

        return{
            message:"Login successful",
            accessToken,
            refreshToken,

            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                role:user.role,
                
            },
            
        };
        
    }

    async refreshToken(refreshToken: string) {
  try {
    const payload = await this.jwtService.verifyAsync<{
      sub: number;
      email: string;
      role: string;
    }>(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const user = await this.userRepository.findOne({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account has been deactivated',
      );
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException(
        'Refresh token not found',
      );
    }

    const isRefreshTokenValid =
      await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }

    const newPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken =
      await this.jwtService.signAsync(
        newPayload,
      );

    const newRefreshToken =
      await this.jwtService.signAsync(
        newPayload,
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      );

    const hashedNewRefreshToken =
      await bcrypt.hash(
        newRefreshToken,
        12,
      );

    user.refreshToken =
      hashedNewRefreshToken;

    await this.userRepository.save(user);

    return {
      message: 'Token refreshed successfully',

      accessToken: newAccessToken,

      refreshToken: newRefreshToken,
    };
  } catch (error) {
    if (
      error instanceof UnauthorizedException
    ) {
      throw error;
    }

    throw new UnauthorizedException(
      'Invalid or expired refresh token',
    );
  }
}

async logout(userId: number) {
  const user = await this.userRepository.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new UnauthorizedException(
      'User not found',
    );
  }

  user.refreshToken = null;

  await this.userRepository.save(user);

  return {
    message: 'Logout successful',
  };
}

}
