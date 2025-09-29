import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: string, role?: string) {
    // Si utilisateur est admin, renvoyer toutes les commandes
    if (role === 'admin') {
      return this.prisma.orders.findMany({
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              email: true,
            },
          },
          vehicle: true,
          tracking: true,
        },
      });
    }

    // Si utilisateur est client, renvoyer uniquement ses commandes
    return this.prisma.orders.findMany({
      where: { user_id: userId },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
        vehicle: true,
        tracking: true,
      },
    });
  }

  async findOne(id: string, userId?: string, role?: string) {
    const order = await this.prisma.orders.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
        vehicle: {
          include: {
            seller: true,
          },
        },
        tracking: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Commande avec l'ID ${id} non trouvée`);
    }

    // Si l'utilisateur est un client, vérifier s'il est le propriétaire de la commande
    if (role === 'client' && userId !== order.user_id) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à accéder à cette commande');
    }

    // Si l'utilisateur est un vendeur, vérifier s'il est le vendeur du véhicule
    if (role === 'seller') {
      const seller = await this.prisma.sellers.findFirst({
        where: { user_id: userId },
      });

      if (!seller || seller.id !== order.vehicle.seller_id) {
        throw new ForbiddenException('Vous n\'êtes pas autorisé à accéder à cette commande');
      }
    }

    return order;
  }

  async create(createOrderDto: CreateOrderDto, userId: string) {
    const { vehicle_id, status } = createOrderDto;
//estimated_total, 
    // Vérifier si le véhicule existe et s'il est disponible
    const vehicle = await this.prisma.vehicles.findUnique({
      where: { id: vehicle_id,
       },
      
    });

    if (!vehicle) {
      throw new NotFoundException(`Véhicule avec l'ID ${vehicle_id} non trouvé`);
    }

    if (vehicle.status !== 'available') {
      throw new ForbiddenException('Ce véhicule n\'est pas disponible à la vente');
    }

    // Créer la commande
    const order = await this.prisma.orders.create({
      data: {
        vehicle_id,
        user_id: userId,
        estimated_total: vehicle.price,
        
        status: status || 'pending',
        tracking: {
          create: {
            status: status || 'pending',
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
        vehicle: true,
        tracking: true,
      },
    });

    // Mettre à jour le statut du véhicule
    await this.prisma.vehicles.update({
      where: { id: vehicle_id },
      data: { status: 'sold' },
    });

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, userId?: string, role?: string) {
    // Vérifier si la commande existe
    const order = await this.prisma.orders.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: {
            seller: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Commande avec l'ID ${id} non trouvée`);
    }

    // Si l'utilisateur est un client, vérifier s'il est le propriétaire de la commande
    if (role === 'client' && userId !== order.user_id) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier cette commande');
    }

    // Si l'utilisateur est un vendeur, vérifier s'il est le vendeur du véhicule
    if (role === 'seller') {
      const seller = await this.prisma.sellers.findFirst({
        where: { user_id: userId },
      });

      if (!seller || seller.id !== order.vehicle.seller_id) {
        throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier cette commande');
      }
    }

    // Mettre à jour la commande
    const updatedOrder = await this.prisma.orders.update({
      where: { id },
      data: updateOrderDto,
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
        vehicle: true,
        tracking: true,
      },
    });

    // Si le statut est modifié, ajouter une entrée de suivi
    if (updateOrderDto.status) {
      await this.prisma.order_tracking.create({
        data: {
          order_id: id,
          status: updateOrderDto.status,
        },
      });
    }

    return updatedOrder;
  }

  async remove(id: string, role?: string) {
    // Vérifier si la commande existe
    const order = await this.prisma.orders.findUnique({
      where: { id },
      include: {
        vehicle: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Commande avec l'ID ${id} non trouvée`);
    }

    // Seul un admin peut supprimer une commande
    if (role !== 'admin') {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à supprimer cette commande');
    }

    // Supprimer toutes les entrées de suivi associées
    await this.prisma.order_tracking.deleteMany({
      where: { order_id: id },
    });

    // Mettre à jour le statut du véhicule
    await this.prisma.vehicles.update({
      where: { id: order.vehicle_id },
      data: { status: 'available' },
    });

    // Supprimer la commande
    await this.prisma.orders.delete({
      where: { id },
    });

    return { message: 'Commande supprimée avec succès' };
  }
} 