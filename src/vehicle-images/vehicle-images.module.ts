import { Module } from '@nestjs/common';
import { VehicleImagesService } from './vehicle-images.service';
import { VehicleImagesController } from './vehicle-images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/vehicles',
        filename: (req, file, callback) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  ],
  providers: [VehicleImagesService],
  controllers: [VehicleImagesController],
  exports: [VehicleImagesService],
})
export class VehicleImagesModule {} 