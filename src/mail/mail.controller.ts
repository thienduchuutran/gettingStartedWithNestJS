import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { MailerService } from '@nestjs-modules/mailer';
import { SubscribersService } from 'src/subscribers/subscribers.service';
import { JobsService } from 'src/jobs/jobs.service';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from 'src/subscribers/schemas/subscriber.schema';
import { Job, JobDocument } from 'src/jobs/schemas/job.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
    private mailerService: MailerService,

    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,

    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
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

    const subscribers = await this.subscriberModel.find({  });  //getting each user subscribing
    for (const subs of subscribers) { //looping through each user
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });  //with this we got a whole list of companies having matching skills
      if(jobWithMatchingSkills?.length){  //jobWithMatchingSkills is a list of companies now
        const jobs = jobWithMatchingSkills.map(item => {
          return {
            name: item.name,
            company: item.company.name,
            salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",  //convert to VND
            skills: item.skills
          }
        })

        await this.mailerService.sendMail({
          to: "thduc57@gmail.com",
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: "new-job", // HTML body content
          context: {
            receiver: subs.name,
            jobs: jobs
          }
        });
      }
      //todo
      //build template
    }



  }

}
