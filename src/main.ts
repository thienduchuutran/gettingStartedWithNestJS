import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser'
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService); //since main.ts file ain't have constructor, we gotta add this to use .env file

  const reflector = app.get(Reflector);
  app.useGlobalGuards( new JwtAuthGuard( reflector))  
  app.useGlobalInterceptors(new TransformInterceptor(reflector)); //passing reflector in so we can get metadata


  app.useStaticAssets(join(__dirname, '..', 'public')); //useStaticAssets allows a page to access js, css, img in public folder when being rendered
  app.setBaseViewsDir(join(__dirname, '..', 'views')); //storing view engine in views folder
  app.setViewEngine('ejs');

  app.useGlobalPipes(new ValidationPipe());

  //first step in making the API returned by nestJS uniformed: making the functionality globally
  
  //config CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });

  //config cookies
  app.use(cookieParser())

  //set global prefix
  app.setGlobalPrefix('api')
  //config versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2']
  });

  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
