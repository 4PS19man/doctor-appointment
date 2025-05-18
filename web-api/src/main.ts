import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.enableCors({
    origin: [
      'https://doctor-appointment-web-frontend-flax.vercel.app', 
      
      'http://localhost:3000'                                     
    ],
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  Logger.log(`Application is running on: http://api.schedula.localhost:${port}/${globalPrefix}`);
}

bootstrap();



