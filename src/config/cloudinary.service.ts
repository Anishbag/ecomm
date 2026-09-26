import {Injectable,InternalServerErrorException,} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import type { Express } from 'express';
import multer from 'multer';



@Injectable()
export class CloudinaryService {

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'slipkart/products',
  ): Promise<string> {

    if (!file) {
      throw new InternalServerErrorException(
        'Image file is required',
      );
    }

    return new Promise((resolve, reject) => {

      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
          },

          (error, result) => {

            if (error) {
              reject(
                new InternalServerErrorException(
                  'Image upload failed',
                ),
              );

              return;
            }

            if (!result?.secure_url) {
              reject(
                new InternalServerErrorException(
                  'Cloudinary did not return image URL',
                ),
              );

              return;
            }

            resolve(result.secure_url);
          },
        );

      Readable.from(file.buffer).pipe(
        uploadStream,
      );
    });
  }
}