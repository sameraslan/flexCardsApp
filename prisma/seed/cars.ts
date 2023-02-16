import { faker } from "@faker-js/faker";
import type { Car, PrismaClient } from "@prisma/client";
import { CarType, EngineType, GearboxType } from "@prisma/client";

export async function addCars(prisma: PrismaClient, userUUID: string[]) {
  await prisma.car.deleteMany({});

  const cars: Car[] = [];
  const uuids: string[] = [];

  for (let i = 0; i < 100; i++) {
    const uuid = faker.datatype.uuid();

    const car: Car = {
      id: uuid,
      type: faker.helpers.arrayElement(Object.values(CarType)),
      make: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      vin: faker.vehicle.vin(),
      productionYear: faker.date.past().getFullYear(),
      engineCapacity: faker.datatype.number({ min: 1000, max: 5000 }),
      enginePower: faker.datatype.number({ min: 50, max: 900 }),
      gearboxType: faker.helpers.arrayElement(Object.values(GearboxType)),
      generation: faker.helpers.arrayElement(["I", "II", "III", "IV", "V"]),
      engineType: faker.helpers.arrayElement(Object.values(EngineType)),
      userId: faker.helpers.arrayElement(userUUID),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    cars.push(car);
    uuids.push(uuid);
  }

  await prisma.car.createMany({ data: cars });
  return uuids;
}
