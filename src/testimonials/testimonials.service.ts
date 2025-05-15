import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.testimonials.findMany({
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const testimonial = await this.prisma.testimonials.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });

    if (!testimonial) {
      throw new NotFoundException(`Témoignage avec l'ID ${id} non trouvé`);
    }

    return testimonial;
  }

  async findByUser(userId: string) {
    return this.prisma.testimonials.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async create(createTestimonialDto: CreateTestimonialDto, userId: string) {
    const { message, rating } = createTestimonialDto;

    return this.prisma.testimonials.create({
      data: {
        message,
        rating,
        user_id: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });
  }

  async update(id: string, updateTestimonialDto: UpdateTestimonialDto, userId: string, role: string) {
    // Vérifier si le témoignage existe
    const testimonial = await this.prisma.testimonials.findUnique({
      where: { id },
    });

    if (!testimonial) {
      throw new NotFoundException(`Témoignage avec l'ID ${id} non trouvé`);
    }

    // Si l'utilisateur n'est pas le propriétaire du témoignage et n'est pas admin, interdire
    if (testimonial.user_id !== userId && role !== 'admin') {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à modifier ce témoignage');
    }

    return this.prisma.testimonials.update({
      where: { id },
      data: updateTestimonialDto,
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string, role: string) {
    // Vérifier si le témoignage existe
    const testimonial = await this.prisma.testimonials.findUnique({
      where: { id },
    });

    if (!testimonial) {
      throw new NotFoundException(`Témoignage avec l'ID ${id} non trouvé`);
    }

    // Si l'utilisateur n'est pas le propriétaire du témoignage et n'est pas admin, interdire
    if (testimonial.user_id !== userId && role !== 'admin') {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à supprimer ce témoignage');
    }

    await this.prisma.testimonials.delete({
      where: { id },
    });

    return { message: 'Témoignage supprimé avec succès' };
  }
} 