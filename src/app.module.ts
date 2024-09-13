import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { CompaniesModule } from './companies/companies.module';
import { JobsModule } from './jobs/jobs.module';
import { FilesModule } from './files/files.module';
import { ResumesModule } from './resumes/resumes.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb+srv://hoidanit:duc2784ahihi@cluster0.aznqt.mongodb.net/'),
    MongooseModule.forRootAsync({
      //since app.module can't initialize configService, we gotta load async with this function to use .env file
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'), //this is connecting to mongodb
        connectionFactory: (connection) => {    //adding softDelete plugin globally
          connection.plugin(softDeletePlugin);
          return connection;
          }
         
      }),
      inject: [ConfigService], //this is so that we can use .env file in other modules
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    CompaniesModule,
    JobsModule,
    FilesModule,
    ResumesModule,
    PermissionsModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService,

  ],
})
export class AppModule {}
