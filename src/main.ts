import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true,
      
    }),
  );
  
  await app.listen(process.env.PORT ?? 3000);

  console.log(`server running on http://localhost:${process.env.PORT ?? 3000},`);
}
await bootstrap();
