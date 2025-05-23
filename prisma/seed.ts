import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Créer un utilisateur admin
  const adminEmail = 'admin@autolinkci.com';
  const existingAdmin = await prisma.users.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    await prisma.users.create({
      data: {
        full_name: 'Administrateur',
        email: adminEmail,
        password_hash: hashedPassword,
        role: 'admin',
        phone_number: '+33123456789',
      }
    });
    
    console.log('Utilisateur admin créé avec succès');
  } else {
    console.log('L\'utilisateur admin existe déjà');
  }
}

main()
  .catch((e) => {
    console.error('Erreur lors de la création de l\'admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 