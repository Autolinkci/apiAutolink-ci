import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { OrderTrackingService } from './order-tracking.service';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('order-tracking')
export class OrderTrackingController {
  constructor(private orderTrackingService: OrderTrackingService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':orderId')
  getTrackingByOrderId(@Param('orderId') orderId: string, @Request() req) {
    return this.orderTrackingService.getTrackingByOrderId(orderId, req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'seller')
  @Post()
  addTracking(@Body() createTrackingDto: CreateTrackingDto, @Request() req) {
    return this.orderTrackingService.addTracking(createTrackingDto, req.user.id, req.user.role);
  }
} 