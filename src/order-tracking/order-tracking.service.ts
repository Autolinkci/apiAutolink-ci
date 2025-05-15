import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackingDto } from './dto/create-tracking.dto';

@Injectable()
export class OrderTrackingService {
  constructor(private prisma: PrismaService) {}

  async getTrackingByOrderId(orderId: string, userId?: string, role?: string) {
    // Vérifier si la commande existe
    const order = await this.prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        vehicle: {
          include: {
            seller: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Commande avec l'ID ${orderId} non trouvée`);
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

    return this.prisma.order_tracking.findMany({
      where: { order_id: orderId },
      orderBy: { updated_at: 'desc' },
    });
  }

  async addTracking(createTrackingDto: CreateTrackingDto, userId?: string, role?: string) {
    const { order_id, status } = createTrackingDto;

    // Vérifier si la commande existe
    const order = await this.prisma.orders.findUnique({
      where: { id: order_id },
      include: {
        vehicle: {
          include: {
            seller: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Commande avec l'ID ${order_id} non trouvée`);
    }

    // Seuls les vendeurs du véhicule et les admins peuvent ajouter un suivi
    if (role === 'client') {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à ajouter un suivi');
    }

    // Si l'utilisateur est un vendeur, vérifier s'il est le vendeur du véhicule
    if (role === 'seller') {
      const seller = await this.prisma.sellers.findFirst({
        where: { user_id: userId },
      });

      if (!seller || seller.id !== order.vehicle.seller_id) {
        throw new ForbiddenException('Vous n\'êtes pas autorisé à ajouter un suivi à cette commande');
      }
    }

    // Ajouter une entrée de suivi
    const tracking = await this.prisma.order_tracking.create({
      data: {
        order_id,
        status,
      },
    });

    // Mettre à jour le statut de la commande
    await this.prisma.orders.update({
      where: { id: order_id },
      data: { status },
    });

    return tracking;
  }
} 