import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "100");

  const logs = await prisma.systemLog.findMany({
    take: limit,
    orderBy: { logTime: "desc" },
    include: {
      user: {
        select: { fullName: true, email: true },
      },
    },
  });

  return NextResponse.json({ logs });
}
