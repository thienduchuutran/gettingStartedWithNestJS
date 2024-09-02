import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}         //consumer

  @Get()  //restful API
  @Render("home")
  handleHomePage() {
    const message = this.appService.getHello()

    return {
      message: message
    }
    // return this.appService.getHello();
  }
}
