import { Module } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [SellersService],
  controllers: [SellersController],
  exports: [SellersService],

})
export class SellersModule {} 