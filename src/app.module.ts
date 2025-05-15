import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SellersModule } from './sellers/sellers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { VehicleImagesModule } from './vehicle-images/vehicle-images.module';
import { OrdersModule } from './orders/orders.module';
import { OrderTrackingModule } from './order-tracking/order-tracking.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SellersModule,
    VehiclesModule,
    VehicleImagesModule,
    OrdersModule,
    OrderTrackingModule,
    TestimonialsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
