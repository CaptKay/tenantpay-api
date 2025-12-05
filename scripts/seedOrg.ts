// scripts/seedOrg.ts
import { prisma } from "../src/prisma";

async function main() {
  const org = await prisma.organization.create({
    data: {
      name: "Demo Org",
      slug: "demo-org",
    },
  });

  console.log("Created organization:", org);
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
 