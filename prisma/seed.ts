import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.upsert({
    where: { email: 'test1@test.com' },
    update: {},
    create: {
      email: 'test1@test.com',
      first_name: 'test1',
      last_name: 'test1',
    },
  });

  console.log(user1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
