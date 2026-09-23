import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../users/entities/user.entity.js';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto.js';
import bcrypt from 'bcrypt';



@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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
}
