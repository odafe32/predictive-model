import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signToken, setAuthCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { fullName, email, password, gender } = parsed.data;

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { fullName, email, passwordHash, gender },
    });

    // Sign JWT and set cookie
    const token = await signToken({ userId: user.id, role: "User" });
    await setAuthCookie(token);

    // Log to system logs
    await prisma.systemLog.create({
      data: { userId: user.id, activity: "register", status: "Success" },
    });

    return NextResponse.json({
      user: { id: user.id, fullName: user.fullName, email: user.email, role: "User" },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
