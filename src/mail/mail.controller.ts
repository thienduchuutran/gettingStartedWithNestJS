import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
    private mailerService: MailerService
  ) {}

  
  @Get()
  @Public()
  @ResponseMessage("Test email")
  async handleTestEmail() {
    const jobs = [
      {name: "abc xyz job",
      company: "ducc",
      salary: "5000",
      skills: ["React", "Node.js"]
      },
      {name: "abc xyz job2222",
        company: "ducc",
        salary: "5000",
        skills: ["React", "Node.js"]
      },
      {name: "abc xyz job3333",
        company: "ducc",
        salary: "5000",
        skills: ["React", "Node.js"]
      }
    ]

    await this.mailerService.sendMail({
      to: "thduc57@gmail.com",
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: "new-job", // HTML body content
      context: {
        receiver: "Duc",
        jobs: jobs
      }
    });
  }

}
