import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
require('dotenv').config()


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);     //since main.ts file ain't have constructor, we gotta add this to use .env file
  app.useStaticAssets(join(__dirname, '..', 'public'));     //useStaticAssets allows a page to access js, css, img in public folder when being rendered
  app.setBaseViewsDir(join(__dirname, '..', 'views'));    //storing view engine in views folder
  app.setViewEngine('ejs'); 

  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
