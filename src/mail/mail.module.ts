import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscriber, SubscriberSchema } from 'src/subscribers/schemas/subscriber.schema';
import { Job, JobSchema } from 'src/jobs/schemas/job.schema';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>("EMAIL_HOST"), //this is gmail server
          secure: false,
          auth: {
             user: configService.get<string>("EMAIL_AUTH_USER"),
             pass: configService.get<string>("EMAIL_AUTH_PASSWORD")
          },
        },

        template: { //__dirname is link to our root foler, then join with 'templates'
          dir: join(__dirname, 'templates'),  //this is telling the lib all our templates files are stored in templates folder
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },

        preview: configService.get<string>("EMAIL_PREVIEW") === 'true' ? true : false,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Subscriber.name, schema: SubscriberSchema }]),
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])
  ],
  controllers: [MailController],
  providers: [MailService]
})
export class MailModule { }

