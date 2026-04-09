import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Suporte a Vercel Postgres e DATABASE_URL local
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@hubcsdt.com';
  const password = 'Hub2026!';
  const hashedPassword = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: {
        name: 'Administrador Hub CSDT',
        email,
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log('Administrador criado:', email);
  } else {
    console.log('Administrador já existe:', email);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
