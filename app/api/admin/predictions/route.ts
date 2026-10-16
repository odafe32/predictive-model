import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const riskFilter = searchParams.get("risk"); // Low | Moderate | High | null
  const search = searchParams.get("search"); // name/email search

  const where: {
    riskLevel?: string;
    user?: {
      OR?: Array<
        { fullName: { contains: string; mode: "insensitive" } } |
        { email: { contains: string; mode: "insensitive" } }
      >;
    };
  } = {};

  if (riskFilter && riskFilter !== "All") {
    where.riskLevel = riskFilter;
  }

  if (search) {
    where.user = {
      OR: [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  const predictions = await prisma.predictionResult.findMany({
    where,
    include: {
      user: {
        select: { id: true, fullName: true, email: true, gender: true },
      },
      lifestyleData: true,
    },
    orderBy: { predictionDate: "desc" },
    take: 500,
  });

  return NextResponse.json({ predictions });
}
