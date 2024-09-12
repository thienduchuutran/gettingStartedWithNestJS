import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [  //need to import multer.config.ts here so we can use destination file upload function later anywhere in files.
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    })
  ]
})
export class FilesModule {

}
