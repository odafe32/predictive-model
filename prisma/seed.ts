import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // --- Default Admin User (role: "Admin") ---
  const adminPassword = await bcrypt.hash("admin123", 10);
  const adminEmail = "admin@healthpredict.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        fullName: "System Administrator",
        email: adminEmail,
        passwordHash: adminPassword,
        gender: "Male",
        role: "Admin",
      },
    });
    console.log(`Created admin user: ${adminEmail} (password: admin123)`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  // --- Sample Users ---
  const users = [
    {
      fullName: "John Doe",
      email: "john@example.com",
      gender: "Male",
      password: "password123",
    },
    {
      fullName: "Jane Smith",
      email: "jane@example.com",
      gender: "Female",
      password: "password123",
    },
    {
      fullName: "Emeka Okoro",
      email: "emeka@example.com",
      gender: "Male",
      password: "password123",
    },
  ];

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (existing) {
      console.log(`User already exists: ${u.email}`);
      continue;
    }

    const passwordHash = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.create({
      data: {
        fullName: u.fullName,
        email: u.email,
        gender: u.gender,
        passwordHash,
      },
    });
    console.log(`Created user: ${user.email}`);

    // Log registration
    await prisma.systemLog.create({
      data: {
        userId: user.id,
        activity: "register",
        status: "Success",
      },
    });

    // Add a sample lifestyle entry + prediction for each user
    const lifestyle = await prisma.lifestyleData.create({
      data: {
        userId: user.id,
        age: 35 + Math.floor(Math.random() * 20),
        bmi: parseFloat((22 + Math.random() * 10).toFixed(2)),
        physicalActivity: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)],
        smokingStatus: ["Never", "Former", "Current"][Math.floor(Math.random() * 3)],
        alcoholConsumption: ["None", "Occasional", "Frequent", "Heavy"][Math.floor(Math.random() * 4)],
        dietQuality: ["Poor", "Average", "Good"][Math.floor(Math.random() * 3)],
        stressLevel: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)],
        familyHistory: Math.random() > 0.5,
      },
    });

    const riskProbability = parseFloat((Math.random()).toFixed(2));
    const riskLevel =
      riskProbability < 0.33 ? "Low" : riskProbability < 0.66 ? "Moderate" : "High";

    await prisma.predictionResult.create({
      data: {
        userId: user.id,
        lifestyleId: lifestyle.id,
        riskProbability: riskProbability * 100,
        riskLevel,
      },
    });

    await prisma.systemLog.create({
      data: {
        userId: user.id,
        activity: "prediction",
        status: "Success",
      },
    });

    console.log(`  -> Added lifestyle data + prediction for ${user.email}`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
