import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin";

export function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/reports", request.url), 303);
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    maxAge: 0,
    path: "/admin",
  });
  return response;
}
