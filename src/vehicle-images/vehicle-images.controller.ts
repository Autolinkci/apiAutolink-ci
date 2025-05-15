import { Controller, Delete, Get, Param, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { VehicleImagesService } from './vehicle-images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('vehicle-images')
export class VehicleImagesController {
  constructor(private vehicleImagesService: VehicleImagesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @Post(':vehicleId')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('vehicleId') vehicleId: string,
    @Request() req,
  ) {
    const imageUrl = `uploads/vehicles/${file.filename}`;
    
    if (req.user.role === 'admin') {
      return this.vehicleImagesService.addImage(vehicleId, imageUrl);
    }
    
    return this.vehicleImagesService.addImage(
      vehicleId,
      imageUrl,
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