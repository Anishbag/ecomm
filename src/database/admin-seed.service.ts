import {Injectable,OnModuleInit} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User,UserRole,} from '../users/entities/user.entity.js';


@Injectable()
export class AdminSeedService implements OnModuleInit
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    const adminEmail =
      process.env.ADMIN_EMAIL
        ?.trim()
        .toLowerCase();

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    const adminName =
      process.env.ADMIN_NAME ||
      'Slipkart Admin';

    const adminPhone =
      process.env.ADMIN_PHONE || '';

    if (!adminEmail || !adminPassword) {
      console.log(
        'Admin environment variables are missing',
      );

      return;
    }

    const existingAdmin =
      await this.userRepository.findOne({
        where: {
          email: adminEmail,
        },
      });

    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const hashedPassword =
      await bcrypt.hash(
        adminPassword,
        12,
      );

    const admin =
      this.userRepository.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        phone: adminPhone,
        role: UserRole.ADMIN,
        isActive: true,
        refreshToken: null,
      });

    await this.userRepository.save(admin);

    console.log(
      'Fixed Admin created successfully',
    );
  }
}