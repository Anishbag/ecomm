import { Module } from '@nestjs/common';
import { cloudinaryConfig } from './cloudinary.config.js';
import { CloudinaryService } from './cloudinary.service.js';

@Module({
  providers: [
    cloudinaryConfig,
    CloudinaryService,
  ],

  exports: [
    CloudinaryService,
  ],
})
export class AppConfigModule {}