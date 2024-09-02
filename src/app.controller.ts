import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService       //this is so that we can use .env file in other modules
  ) {}         //consumer

  @Get()  //restful API
  @Render("home")
  handleHomePage() {
    //port from .env
    console.log('check port = ', this.configService.get<string>("PORT"))

    const message = this.appService.getHello()

    return {
      message: message
    }
    // return this.appService.getHello();
  }
}
