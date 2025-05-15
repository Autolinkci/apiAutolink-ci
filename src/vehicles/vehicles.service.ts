import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.vehicles.findMany({
      include: {
        images: true,
        seller: {
          include: {
            user: {
              select: {
                id: true,
                full_name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicles.findUnique({
      where: { id },
      include: {
        images: true,
        seller: {
          include: {
            user: {
              select: {
                id: true,
                full_name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException(`Véhicule avec l'ID ${id} non trouvé`);
    }

    return vehicle;
  }

  async create(createVehicleDto: CreateVehicleDto, userId?: string) {
    const { seller_id, ...data } = createVehicleDto;

    // Si l'utilisateur est un vendeur, vérifier si le vendeur existe
    if (userId) {
      const seller = await this.prisma.sellers.findFirst({
        where: { user_id: userId },
      });

      if (!seller) {
        throw new ForbiddenException('Vous devez être un vendeur pour créer un véhicule');
      }

      return this.prisma.vehicles.create({
        data: {
          ...data,
          seller_id: seller.id,
        },
        include: {
          images: true,
          seller: {
            include: {
              user: {
                select: {
                  id: true,
                  full_name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    }

    // Sinon, utiliser le seller_id fourni (cas d'un admin)
    return this.prisma.vehicles.create({
      data: {
        ...data,
        seller_id,
      },
      include: {
        images: true,
        seller: {
          include: {
            user: {
              select: {
                id: true,
                full_name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto, userId?: string, role?: string) {
    // Vérifier si le véhicule existe
    const vehicle = await this.prisma.vehicles.findUnique({
      where: { id },
      include: {
        seller: true,
      },
    });

    if (!vehicle) {
      throw new NotFoundException(`Véhicule avec l'ID ${id} non trouvé`);
    }

    // Si l'utilisateur est un vendeur, vérifier s'il est le propriétaire du véhicule
    if (role === 'seller' && userId) {
      const seller = await this.prisma.sellers.findFirst({
        where: { user_id: userId },
      });

      if (!seller || seller.id !== vehicle.seller_id) {
        throw new ForbiddenException('Vous ne pouvez pas modifier ce véhicule');
      }
    }

    return this.prisma.vehicles.update({
      where: { id },
      data: updateVehicleDto,
      include: {
        images: true,
        seller: {
          include: {
            user: {
              select: {
                id: true,
                full_name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string, userId?: string, role?: string) {
    // Vérifier si le véhicule existe
    const vehicle = await this.prisma.vehicles.findUnique({
      where: { id },
      include: {
        seller: true,
      },
    });

    if (!vehicle) {
      throw new NotFoundException(`Véhicule avec l'ID ${id} non trouvé`);
    }

    // Si l'utilisateur est un vendeur, vérifier s'il est le propriétaire du véhicule
    if (role === 'seller' && userId) {
      const seller = await this.prisma.sellers.findFirst({
        where: { user_id: userId },
      });

      if (!seller || seller.id !== vehicle.seller_id) {
        throw new ForbiddenException('Vous ne pouvez pas supprimer ce véhicule');
      }
    }

    await this.prisma.vehicles.delete({
      where: { id },
    });

    return { message: 'Véhicule supprimé avec succès' };
  }
} 