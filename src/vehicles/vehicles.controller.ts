import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('vehicles')
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto, @Request() req) {
    if (req.user.role === 'admin') {
      return this.vehiclesService.create(createVehicleDto);
    }
    return this.vehiclesService.create(createVehicleDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto, @Request() req) {
    if (req.user.role === 'admin') {
      return this.vehiclesService.update(id, updateVehicleDto);
    }
    return this.vehiclesService.update(id, updateVehicleDto, req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    if (req.user.role === 'admin') {
      return this.vehiclesService.remove(id);
    }
    return this.vehiclesService.remove(id, req.user.id, req.user.role);
  }
}