import { faker } from "@faker-js/faker";
import type { PrismaClient, Repair } from "@prisma/client";

export async function addRepairs(prisma: PrismaClient, carUUID: string[]) {
  await prisma.repair.deleteMany({});

  const repairs: Repair[] = [];

  for (let i = 0; i < 3000; i++) {
    const repair: Repair = {
      id: faker.datatype.uuid(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      date: faker.date.past(),
      mileage: faker.datatype.number({ min: 10000, max: 100000 }),
      price: faker.datatype.number({ min: 100, max: 10000 }),
      carId: faker.helpers.arrayElement(carUUID),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    repairs.push(repair);
  }

  await prisma.repair.createMany({ data: repairs });
}
