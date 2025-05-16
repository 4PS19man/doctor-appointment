/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// import { Logger } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app/app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const globalPrefix = 'api';
//   app.setGlobalPrefix(globalPrefix);
//   const port = process.env.PORT || 3000;
//   await app.listen(port);
//   Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
// }

// bootstrap();


// import { Logger } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app/app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const globalPrefix = 'api';
//   app.setGlobalPrefix(globalPrefix);
//   const port = process.env.PORT || 3001;
//   await app.listen(port, '0.0.0.0');
//   Logger.log(`🚀 Application is running on: http://api.schedula.localhost:${port}/${globalPrefix}`);
// }

// bootstrap();




import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS to allow frontend access
  app.enableCors({
    origin: 'http://localhost:3000', // frontend origin
    credentials: true, // if you send cookies or auth headers (can be false if not needed)
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  Logger.log(`🚀 Application is running on: http://api.schedula.localhost:${port}/${globalPrefix}`);
}

bootstrap();



