import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { ApproveSellerDto } from './dto/approve-seller.dto';
import { ApplyCompanyDto } from './dto/apply-company.dto';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) { }

  async apply(userId: string, dto: CreateSellerDto) {
    // Vérifier si une candidature existe déjà
    const existing = await this.prisma.sellers.findUnique({ where: { user_id: userId } });
    if (existing) throw new ConflictException('Déjà candidat ou vendeur.');
    return this.prisma.sellers.create({
      data: { ...dto, user_id: userId, is_approved: false }
    });
  }

  async applyCompany(dto: ApplyCompanyDto,userId:string) {
    // Vérifier si l'utilisateur a déjà une candidature
    const existingUser = await this.prisma.sellers.findUnique({ where: { user_id: userId } });
    if (existingUser) throw new ConflictException('Vous avez déjà une candidature en cours.');
    
    // Vérifier si une entreprise avec ce nom existe déjà
    const existingCompany = await this.prisma.sellers.findFirst({
      where: {
        company_name: dto.company_name,
        is_company: true,
      }
    });
    if (existingCompany) throw new ConflictException('Entreprise déjà candidate.');
    
    return this.prisma.sellers.create({
      data: {
        company_name: dto.company_name,
        country: dto.country,
        is_company: true,
        is_approved: false,
        email: dto.email,
        phone_number: dto.phone_number,
        user_id: userId
      }
    });
  }

  async getPending() {
    return this.prisma.sellers.findMany({ where: { is_approved: false } });
  }

  async approve(id: string, is_approved: boolean) {
    const seller = await this.prisma.sellers.findUnique({ where: { id } });
    if (!seller) throw new NotFoundException('Candidature non trouvée');
    await this.prisma.sellers.update({ where: { id }, data: { is_approved } });
    if (is_approved && seller.user_id) {
      await this.prisma.users.update({ where: { id: seller.user_id }, data: { role: 'seller' } });
    }
    return { success: true };
  }

  async findByUser(userId: string) {
    const seller = await this.prisma.sellers.findUnique({ where: { user_id: userId } });
    if (!seller) throw new NotFoundException('Vendeur non trouvé');
    return seller;
  }

  async findOne(id: string) {
    const seller = await this.prisma.sellers.findUnique({ where: { id } });
    if (!seller) throw new NotFoundException('Vendeur non trouvé');
    return seller;
  }
} 