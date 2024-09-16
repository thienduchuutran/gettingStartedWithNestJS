import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { TerminusModule } from '@nestjs/terminus';  

@Module({
  imports: [TerminusModule],  //gotta import here so that health.controller can use MongooseHealthIndicator
  controllers: [HealthController]
})
export class HealthModule {}
