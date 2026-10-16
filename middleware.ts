import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "auth_token";
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-me"
);

// Routes that require authentication
const protectedPaths = ["/dashboard", "/predict", "/history", "/profile"];
// Routes that require admin
const adminPaths = ["/admin"];

async function verifyToken(token: string): Promise<{ userId: number; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as { userId: number; role: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Check admin routes — require role "Admin"
  if (adminPaths.some((p) => pathname.startsWith(p))) {
    const decoded = token ? await verifyToken(token) : null;
    if (!decoded) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (decoded.role !== "Admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Check protected routes — require authentication
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    if (!token || !(await verifyToken(token))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/predict/:path*", "/history/:path*", "/profile/:path*", "/admin/:path*"],
};
