import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { ApproveSellerDto } from './dto/approve-seller.dto';
import { ApplyCompanyDto } from './dto/apply-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('sellers')
export class SellersController {
  constructor(private sellersService: SellersService) {}

  // Postuler comme vendeur
  @UseGuards(JwtAuthGuard)
  @Post('apply')
  applyAsSeller(@Request() req, @Body() dto: CreateSellerDto) {
    return this.sellersService.apply(req.user.id, dto);
  }

  // Postuler comme entreprise
  @Post('apply-company')
  applyAsCompany(@Body() dto: ApplyCompanyDto) {
    return this.sellersService.applyCompany(dto);
  }

  // Infos du vendeur connecté
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('seller')
  @Get('me')
  getMe(@Request() req) {
    return this.sellersService.findByUser(req.user.id);
  }

  // Liste des candidatures en attente (admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('pending')
  getPendingSellers() {
    return this.sellersService.getPending();
  }

  // Approuver/refuser une candidature (admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('approve/:id')
  approveSeller(@Param('id') id: string, @Body() dto: ApproveSellerDto) {
    return this.sellersService.approve(id, dto.is_approved);
  }

  // Infos d'un vendeur par id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellersService.findOne(id);
  }
} 