import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    id: session.id,
    fullName: session.fullName,
    email: session.email,
    gender: session.gender,
    role: session.role,
    createdAt: session.createdAt,
  });
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, gender, currentPassword, newPassword } = body;

    const data: { fullName?: string; gender?: string; passwordHash?: string } = {};

    if (fullName) {
      if (fullName.trim().length < 3) {
        return NextResponse.json({ error: "Full name must be at least 3 characters" }, { status: 400 });
      }
      data.fullName = fullName.trim();
    }

    if (gender) {
      data.gender = gender;
    }

    // Handle password change
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
      }
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to change password" }, { status: 400 });
      }

      // Verify current password
      const user = await prisma.user.findUnique({
        where: { id: session.id },
        select: { passwordHash: true },
      });

      if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }

      data.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await prisma.user.update({
      where: { id: session.id },
      data,
    });

    // Log activity
    await prisma.systemLog.create({
      data: {
        userId: session.id,
        activity: "Profile updated",
        status: "Success",
      },
    });

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
