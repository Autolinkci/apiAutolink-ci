import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VehicleImagesService {
  constructor(private prisma: PrismaService) {}

  async addImage(vehicleId: string, imageUrl: string, userId?: string, role?: string) {
    // Vérifier si le véhicule existe
    const vehicle = await this.prisma.vehicles.findUnique({
      where: { id: vehicleId },
      include: {
        seller: true,
      },
    });

    if (!vehicle) {
      // Supprimer le fichier si le véhicule n'existe pas
      fs.unlink(path.join(process.cwd(), imageUrl), (err) => {
        if (err) console.error('Erreur lors de la suppression du fichier', err);
      });
      throw new NotFoundException(`Véhicule avec l'ID ${vehicleId} non trouvé`);
    }

    // Si l'utilisateur est un vendeur, vérifier s'il est le propriétaire du véhicule
    if (role === 'seller' && userId) {
      const seller = await this.prisma.sellers.findFirst({
        where: { user_id: userId },
      });

      if (!seller || seller.id !== vehicle.seller_id) {
        // Supprimer le fichier si l'utilisateur n'est pas le propriétaire du véhicule
        fs.unlink(path.join(process.cwd(), imageUrl), (err) => {
          if (err) console.error('Erreur lors de la suppression du fichier', err);
        });
        throw new ForbiddenException('Vous ne pouvez pas ajouter d\'image à ce véhicule');
      }
    }

    // Ajouter l'image
    return this.prisma.vehicleImage.create({
      data: {
        url: imageUrl,
        vehicleId,
      },
    });
  }

  async addImages(vehicleId: string, files: Express.Multer.File[], userId?: string, role?: string) {
    // Vérifier si le véhicule existe
    const vehicle = await this.prisma.vehicles.findUnique({
      where: { id: vehicleId },
      include: {
        seller: true,
      },
    });

    if (!vehicle) {
      // Supprimer tous les fichiers si le véhicule n'existe pas
      files.forEach(file => {
        fs.unlink(path.join(process.cwd(), `uploads/vehicles/${file.filename}`), (err) => {
          if (err) console.error('Erreur lors de la suppression du fichier', err);
        });
      });
      throw new NotFoundException(`Véhicule avec l'ID ${vehicleId} non trouvé`);
    }

    // Si l'utilisateur est un vendeur, vérifier s'il est le propriétaire du véhicule
    if (role === 'seller' && userId) {
      const seller = await this.prisma.sellers.findFirst({
        where: { user_id: userId },
      });

      if (!seller || seller.id !== vehicle.seller_id) {
        // Supprimer tous les fichiers si l'utilisateur n'est pas le propriétaire du véhicule
        files.forEach(file => {
          fs.unlink(path.join(process.cwd(), `uploads/vehicles/${file.filename}`), (err) => {
            if (err) console.error('Erreur lors de la suppression du fichier', err);
          });
        });
        throw new ForbiddenException('Vous ne pouvez pas ajouter d\'images à ce véhicule');
      }
    }

    // Créer toutes les images en une seule transaction
    const imageData = files.map(file => ({
      url: `uploads/vehicles/${file.filename}`,
      vehicleId,
    }));

    const createdImages = await this.prisma.vehicleImage.createMany({
      data: imageData,
    });

    return {
      message: `${files.length} image(s) ajoutée(s) avec succès`,
      count: createdImages.count,
      images: imageData,
    };
  }

  async removeImage(id: string, userId?: string, role?: string) {
    // Vérifier si l'image existe
    const image = await this.prisma.vehicleImage.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: {
            seller: true,
          },
        },
      },
    });

    if (!image) {
      throw new NotFoundException(`Image avec l'ID ${id} non trouvée`);
    }

    // Si l'utilisateur est un vendeur, vérifier s'il est le propriétaire du véhicule
    if (role === 'seller' && userId) {
      const seller = await this.prisma.sellers.findFirst({
        where: { user_id: userId },
      });

      if (!seller || seller.id !== image.vehicle.seller_id) {
        throw new ForbiddenException('Vous ne pouvez pas supprimer cette image');
      }
    }

    // Supprimer le fichier
    fs.unlink(path.join(process.cwd(), image.url), (err) => {
      if (err) console.error('Erreur lors de la suppression du fichier', err);
    });

    // Supprimer l'image de la base de données
    await this.prisma.vehicleImage.delete({
      where: { id },
    });

    return { message: 'Image supprimée avec succès' };
  }

  async getImagesByVehicleId(vehicleId: string) {
    // Vérifier si le véhicule existe
    const vehicle = await this.prisma.vehicles.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Véhicule avec l'ID ${vehicleId} non trouvé`);
    }

    return this.prisma.vehicleImage.findMany({
      where: { vehicleId },
    });
  }
} 