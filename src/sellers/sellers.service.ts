import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

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
      data: { role: 'seller' },
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

  async update(id: string, updateSellerDto: UpdateSellerDto, userId?: string, role?: string) {
    // Vérifier si le vendeur existe
    const seller = await this.prisma.sellers.findUnique({
      where: { id },
    });

    if (!seller) {
      throw new NotFoundException(`Vendeur avec l'ID ${id} non trouvé`);
    }

    // Si l'utilisateur n'est pas admin et n'est pas le vendeur lui-même, interdire
    if (role !== 'admin' && seller.user_id !== userId) {
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

  async remove(id: string, role?: string) {
    // Seul un admin peut supprimer un vendeur
    if (role !== 'admin') {
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
      data: { role: 'client' },
    });

    // Supprimer le vendeur
    await this.prisma.sellers.delete({
      where: { id },
    });

    return { message: 'Vendeur supprimé avec succès' };
  }
} 