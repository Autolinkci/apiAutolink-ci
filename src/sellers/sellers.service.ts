import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { ApproveSellerDto } from './dto/approve-seller.dto';
import { Role } from './dto/role-enum';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sellers.findMany({
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone_number: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const seller = await this.prisma.sellers.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone_number: true,
          },
        },
        vehicles: true,
      },
    });

    if (!seller) {
      throw new NotFoundException(`Vendeur avec l'ID ${id} non trouvé`);
    }

    return seller;
  }

  async findByUser(userId: string) {
    const seller = await this.prisma.sellers.findUnique({
      where: { user_id: userId },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone_number: true,
          },
        },
        vehicles: true,
      },
    });

    if (!seller) {
      throw new NotFoundException(`Vendeur pour l'utilisateur avec l'ID ${userId} non trouvé`);
    }

    return seller;
  }

  async create(createSellerDto: CreateSellerDto) {
    const { user_id, ...rest } = createSellerDto;

    // Vérifier si l'utilisateur existe
    const user = await this.prisma.users.findUnique({
      where: { id: user_id },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${user_id} non trouvé`);
    }

    // Vérifier si l'utilisateur est déjà un vendeur
    const existingSeller = await this.prisma.sellers.findUnique({
      where: { user_id },
    });

    if (existingSeller) {
      throw new ConflictException(`L'utilisateur avec l'ID ${user_id} est déjà un vendeur`);
    }

    // Mettre à jour le rôle de l'utilisateur
    await this.prisma.users.update({
      where: { id: user_id },
      data: { role: Role.SELLER },
    });

    // Créer le vendeur
    return this.prisma.sellers.create({
      data: {
        user_id,
        ...rest,
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone_number: true,
          },
        },
      },
    });
  }

  async update(id: string, updateSellerDto: UpdateSellerDto, userId?: string, userRole?: string) {
    // Vérifier si le vendeur existe
    const seller = await this.prisma.sellers.findUnique({
      where: { id },
    });

    if (!seller) {
      throw new NotFoundException(`Vendeur avec l'ID ${id} non trouvé`);
    }

    // Si l'utilisateur n'est pas admin et n'est pas le vendeur lui-même, interdire
    if (userRole !== Role.ADMIN && seller.user_id !== userId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier ce vendeur');
    }

    return this.prisma.sellers.update({
      where: { id },
      data: updateSellerDto,
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            phone_number: true,
          },
        },
      },
    });
  }

  async remove(id: string, userRole?: string) {
    // Seul un admin peut supprimer un vendeur
    if (userRole !== Role.ADMIN) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à supprimer un vendeur');
    }

    // Vérifier si le vendeur existe
    const seller = await this.prisma.sellers.findUnique({
      where: { id },
      include: {
        vehicles: true,
      },
    });

    if (!seller) {
      throw new NotFoundException(`Vendeur avec l'ID ${id} non trouvé`);
    }

    // Vérifier si le vendeur a des véhicules
    if (seller.vehicles.length > 0) {
      throw new ConflictException('Ce vendeur a des véhicules et ne peut pas être supprimé');
    }

    // Remettre le rôle de l'utilisateur à client
    await this.prisma.users.update({
      where: { id: seller.user_id },
      data: { role: Role.CLIENT },
    });

    // Supprimer le vendeur
    await this.prisma.sellers.delete({
      where: { id },
    });

    return { message: 'Vendeur supprimé avec succès' };
  }

  async findPendingSellers() {
    // Trouver tous les utilisateurs avec le rôle 'pending_seller'
    const users = await this.prisma.users.findMany({
      where: { role: Role.PENDING_SELLER },
      include: {
        sellers: true,
      },
    });

    return users.map(user => ({
      user_id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      created_at: user.created_at,
      role: Role.PENDING_SELLER,
      seller: user.sellers ? {
        id: user.sellers.id,
        company_name: user.sellers.company_name,
        country: user.sellers.country,
        is_approved: user.sellers.is_approved,
      } : null,
    }));
  }

  async approveSeller(id: string, approveSellerDto: ApproveSellerDto) {
    // Vérifier si le vendeur existe
    const seller = await this.prisma.sellers.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!seller) {
      throw new NotFoundException(`Vendeur avec l'ID ${id} non trouvé`);
    }

    // Mettre à jour le statut d'approbation du vendeur
    await this.prisma.sellers.update({
      where: { id },
      data: { 
        is_approved: approveSellerDto.is_approved
      },
    });

    // Mettre à jour le rôle de l'utilisateur
    await this.prisma.users.update({
      where: { id: seller.user_id },
      data: { 
        role: approveSellerDto.is_approved ? Role.SELLER : Role.PENDING_SELLER
      },
    });

    return {
      id: seller.id,
      user_id: seller.user_id,
      company_name: seller.company_name,
      country: seller.country,
      is_approved: approveSellerDto.is_approved,
      user: {
        id: seller.user.id,
        full_name: seller.user.full_name,
        email: seller.user.email,
        role: approveSellerDto.is_approved ? Role.SELLER : Role.PENDING_SELLER,
      },
    };
  }
} 