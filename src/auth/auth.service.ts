import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { full_name, email, password, phone_number, is_seller, company_name, country } = registerDto;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await this.prisma.users.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    // Déterminer le rôle initial
    const role = is_seller ? 'pending_seller' : 'client';

    // Créer l'utilisateur
    const user = await this.prisma.users.create({
      data: {
        full_name,
        email,
        phone_number,
        password_hash,
      },
    });

    // Si l'utilisateur s'inscrit en tant que vendeur, créer son profil vendeur
    if (is_seller) {
      await this.prisma.sellers.create({
        data: {
          user_id: user.id,
          company_name,
          country,
        is_approved:false
        },
      });
    }

    // Générer le token JWT
    const token = this.generateToken(user);

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      token,
    };
  }

  async login(loginDto: LoginDto) {
    //destructuration de loginDto
    const { email, password } = loginDto;

    // Rechercher l'utilisateur par email
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    // Générer le token JWT
    const token = this.generateToken(user);

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      token,
    };
  }

  private generateToken(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
} 