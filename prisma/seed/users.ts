import { faker } from "@faker-js/faker";
import type { PrismaClient, User } from "@prisma/client";
import * as argon from "argon2";

export async function addUsers(prisma: PrismaClient) {
  await prisma.user.deleteMany({});

  const users: User[] = [];
  const uuids: string[] = [];

  for (let i = 0; i < 10; i++) {
    const uuid = faker.datatype.uuid();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    const user: User = {
      id: uuid,
      name: `${firstName} ${lastName}`,
      email: faker.internet.email(firstName, lastName),
      emailVerified: faker.datatype.datetime(),
      hash: await argon.hash("Password1234%"),
      firstName: firstName,
      lastName: lastName,
      image: faker.image.avatar(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    users.push(user);
    uuids.push(uuid);
  }

  await prisma.user.createMany({ data: users });

  return uuids;
}
