import { PrismaClient } from '@prisma/client';

// Suporte a Vercel Postgres e DATABASE_URL local
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@hubcsdt.com';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: {
        name: 'Administrador Hub CSDT',
        email,
        // Login por senha foi removido; o campo permanece no schema apenas
        // para compatibilidade com bancos existentes.
        password: 'login-desativado',
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
