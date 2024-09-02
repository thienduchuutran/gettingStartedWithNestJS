import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));     //useStaticAssets allows a page to access js, css, img in public folder when being rendered
  app.setBaseViewsDir(join(__dirname, '..', 'views'));    //storing view engine in views folder
  app.setViewEngine('ejs'); 

  await app.listen(5000);
}
bootstrap();
