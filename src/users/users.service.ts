import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.users.findMany({
      select: {
        id: true,
        full_name: true,
        email: true,
        phone_number: true,
        role: true,
        created_at: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone_number: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    
    // Hasher le mot de passe
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    return this.prisma.users.create({
      data: {
        password_hash,
        full_name: rest.full_name,
        email: rest.email,
        phone_number: rest.phone_number,
        role: (rest.role as UserRole) ?? UserRole.client,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        phone_number: true,
        role: true,
        created_at: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;
    
    // Vérifier si l'utilisateur existe
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    // Mettre à jour les données de l'utilisateur
    let data: any = { ...rest };
    
    // Si un nouveau mot de passe est fourni, le hasher
    if (password) {
      const salt = await bcrypt.genSalt();
      const password_hash = await bcrypt.hash(password, salt);
      data = { ...data, password_hash };
    }

    return this.prisma.users.update({
      where: { id },
      data,
      select: {
        id: true,
        full_name: true,
        email: true,
        phone_number: true,
        role: true,
        created_at: true,
      },
    });
  }

  async remove(id: string) {
    // Vérifier si l'utilisateur existe
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    await this.prisma.users.delete({
      where: { id },
    });

    return { message: 'Utilisateur supprimé avec succès' };
  }
} 