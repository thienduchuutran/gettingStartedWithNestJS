import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schema/company.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
  ], //CompanyServices ain't know the existence of companyModal and mongoose, thus needs to import here
  controllers: [CompaniesController],
  providers: [CompaniesService],
  // exports: [CompaniesService]   
})
export class CompaniesModule {}
