import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser'
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService); //since main.ts file ain't have constructor, we gotta add this to use .env file

  const reflector = app.get(Reflector);
  app.useGlobalGuards( new JwtAuthGuard( reflector))  //this is to protect endpoints (backend user authorization)

  app.useGlobalInterceptors(new TransformInterceptor(reflector)); //passing reflector in so we can get metadata


  app.useStaticAssets(join(__dirname, '..', 'public')); //useStaticAssets allows a page to access js, css, img in public folder when being rendered
  app.setBaseViewsDir(join(__dirname, '..', 'views')); //storing view engine in views folder
  app.setViewEngine('ejs');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true //so that we don't lose data when updating, and if user passes extra data it won't update the extra
  }));

  //first step in making the API returned by nestJS uniformed: making the functionality globally
  
  //config CORS
  app.enableCors({
    'origin': true, //if set * means allowing anywhere to connect, true means only same domain can connect
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    credentials: true  //allow client and server passing data
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

  //config helmet
  app.use(helmet());

  //config swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS Series APIs Document')
    .setDescription('All Modules APIs')
    .setVersion('1.0')
    .addBearerAuth( 
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document,  {
    swaggerOptions: {
      persistAuthorization: true, //this is so that when we F5 swagger UI, the bearer token ain't gone
    }
  }
);

  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
