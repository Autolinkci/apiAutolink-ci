import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
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
    //comparer le rôle de l'utilisateur actuellement connecté avec les rôles requis
    return requiredRoles.some((role) => user.role === role);
  }
} 