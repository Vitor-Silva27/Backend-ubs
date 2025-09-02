import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.admin.findFirst();
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

    await prisma.admin.create({
      data: {
        username: process.env.ADMIN_EMAIL!,
        password: hashedPassword,
        telefone: process.env.ADMIN_TELEFONE!,
      },
    });

    console.log("Admin created");
  } else {
    console.log("Admin already exists, no user created.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error(err);
    prisma.$disconnect();
    process.exit(1);
  });
