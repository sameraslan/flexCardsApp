import { PrismaClient } from "@prisma/client";

import { addCars } from "./seed/cars";
import { addRepairs } from "./seed/repairs";
import { addUsers } from "./seed/users";

const prisma = new PrismaClient();

async function main() {
  const userUUID = await addUsers(prisma);
  const carUUID = await addCars(prisma, userUUID);
  await addRepairs(prisma, carUUID);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
