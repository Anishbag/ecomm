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
}
