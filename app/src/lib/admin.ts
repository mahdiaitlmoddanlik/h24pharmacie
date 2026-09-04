import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "pharmacies_admin_session";
const SESSION_SCOPE = "pharmacies-garde-maroc:reports:v1";

function adminToken() {
  return process.env.ADMIN_REPORT_TOKEN;
}

function secureEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function isAdminConfigured() {
  return (adminToken()?.length ?? 0) >= 32;
}

export function isValidAdminToken(candidate: string) {
  const token = adminToken();
  return Boolean(token && candidate && secureEqual(candidate, token));
}

export function createAdminSession() {
  const token = adminToken();
  if (!token) throw new Error("ADMIN_REPORT_TOKEN is not configured.");
  return createHmac("sha256", token).update(SESSION_SCOPE).digest("base64url");
}

export async function isAdminAuthenticated() {
  if (!isAdminConfigured()) return false;
  const session = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  return Boolean(session && secureEqual(session, createAdminSession()));
}

export async function assertAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized administrator action.");
  }
}
