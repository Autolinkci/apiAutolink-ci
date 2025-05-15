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
    const { full_name, email, password, phone_number } = registerDto;

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

    // Créer l'utilisateur
    const user = await this.prisma.users.create({
      data: {
        full_name,
        email,
        phone_number,
        password_hash,
      },
    });

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