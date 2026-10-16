import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      gender: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          predictionResults: true,
          lifestyleData: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = parseInt(searchParams.get("id") || "0");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  if (userId === session.id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  // Delete user and all related data
  await prisma.user.delete({ where: { id: userId } });

  await prisma.systemLog.create({
    data: {
      userId: session.id,
      activity: `Deleted user ID: ${userId}`,
      status: "Success",
    },
  });

  return NextResponse.json({ message: "User deleted successfully" });
}
