import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}         //consumer

  @Get()  //restful API
  @Render("home")
  getHello() {
    // return this.appService.getHello();
  }
}
