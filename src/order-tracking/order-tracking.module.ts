import { Module } from '@nestjs/common';
import { OrderTrackingService } from './order-tracking.service';
import { OrderTrackingController } from './order-tracking.controller';

@Module({
  providers: [OrderTrackingService],
  controllers: [OrderTrackingController],
  exports: [OrderTrackingService],
})
export class OrderTrackingModule {} 