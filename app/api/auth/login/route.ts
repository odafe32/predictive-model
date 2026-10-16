import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { signToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Find user (with retry for Neon connection drops)
    const user = await withRetry(() =>
      prisma.user.findUnique({ where: { email } })
    );
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Verify password
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      // Log failed attempt
      await prisma.systemLog.create({
        data: { userId: user.id, activity: "login", status: "Failed" },
      });
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Sign JWT and set cookie
    const token = await signToken({ userId: user.id, role: user.role });
    await setAuthCookie(token);

    // Log success
    await prisma.systemLog.create({
      data: { userId: user.id, activity: "login", status: "Success" },
    });

    return NextResponse.json({
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
