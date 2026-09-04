import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSession,
  isAdminConfigured,
  isValidAdminToken,
} from "@/lib/admin";

function redirectToReports(request: Request, error?: string) {
  const url = new URL("/admin/reports", request.url);
  if (error) url.searchParams.set("error", error);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  }
  if (!isAdminConfigured()) return redirectToReports(request, "configuration");

  const formData = await request.formData();
  const token = formData.get("token");
  if (typeof token !== "string" || !isValidAdminToken(token)) {
    return redirectToReports(request, "invalid");
  }

  const response = redirectToReports(request);
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSession(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/admin",
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
