import { NextResponse, type NextRequest } from "next/server";

/**
 * Exposes the current pathname as a request header so the root layout can
 * compute the active locale and set <html lang/dir> correctly during SSR.
 */
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|.*\\.).*)"],
};
