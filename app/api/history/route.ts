import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const predictions = await prisma.predictionResult.findMany({
    where: { userId: user.id },
    include: { lifestyleData: true },
    orderBy: { predictionDate: "desc" },
  });

  return NextResponse.json({ predictions });
}
