import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { PrismaService } from '../../prisma/prisma.service';

// Type augmenté pour les vendeurs


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtenir les rôles requis
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    // Obtenir l'utilisateur actuellement connecté
    const { user } = context.switchToHttp().getRequest();
    
    // Si l'utilisateur est un vendeur en attente (pending_seller), vérifier s'il essaie d'accéder aux fonctionnalités vendeur
    if (user.role === 'pending_seller' && requiredRoles.includes('seller')) {
      throw new ForbiddenException('Votre compte vendeur est en attente d\'approbation par un administrateur');
    }

    // Si l'utilisateur est un vendeur, vérifier s'il est approuvé
    if (user.role === 'seller' && requiredRoles.includes('seller')) {
      const seller = await this.prisma.sellers.findFirst({
        where: { user_id: user.id }
      });
      
      // Utiliser l'interface étendue pour accéder à is_approved
      // const sellerWithApproval = seller as unknown as SellerWithApproval;
      
      if (!seller || !seller.is_approved) {
        throw new ForbiddenException('Votre compte vendeur n\'est pas approuvé');
      }
    }
    
    // Comparer le rôle de l'utilisateur actuellement connecté avec les rôles requis
    return requiredRoles.some((role) => {
      if (role === 'seller' && user.role === 'pending_seller') {
        return false;
      }
      return user.role === role;
    });
  }
} 