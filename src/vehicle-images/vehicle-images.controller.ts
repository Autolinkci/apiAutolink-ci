import { Controller, Delete, Get, Param, Post, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { VehicleImagesService } from './vehicle-images.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('vehicle-images')
export class VehicleImagesController {
  constructor(private vehicleImagesService: VehicleImagesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @Post(':vehicleId')
  @UseInterceptors(FilesInterceptor('images', 10)) // Maximum 10 images
  uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('vehicleId') vehicleId: string,
    @Request() req,
  ) {
    if (req.user.role === 'admin') {
      return this.vehicleImagesService.addImages(vehicleId, files);
    }
    
    return this.vehicleImagesService.addImages(
      vehicleId,
      files,
      req.user.id,
      req.user.role,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @Delete(':id')
  removeImage(@Param('id') id: string, @Request() req) {
    if (req.user.role === 'admin') {
      return this.vehicleImagesService.removeImage(id);
    }
    
    return this.vehicleImagesService.removeImage(id, req.user.id, req.user.role);
  }

  @Get('vehicle/:vehicleId')
  getImagesByVehicleId(@Param('vehicleId') vehicleId: string) {
    return this.vehicleImagesService.getImagesByVehicleId(vehicleId);
  }
} 