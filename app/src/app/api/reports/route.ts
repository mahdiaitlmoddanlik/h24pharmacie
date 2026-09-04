import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import type { ReportIssueType } from "@/lib/types";
import { prisma } from "@/lib/prisma";

const VALID_TYPES: ReportIssueType[] = [
  "closed",
  "wrong_phone",
  "wrong_address",
  "not_on_duty",
  "other",
];
const REPORT_WINDOW_MS = 60 * 60 * 1000;
const MAX_REPORTS_PER_WINDOW = 5;

function hashIp(ip: string) {
  const secret =
    process.env.REPORT_IP_HASH_SALT ??
    process.env.DATABASE_URL ??
    "development-only-report-salt";
  return createHmac("sha256", secret).update(ip).digest("hex").slice(0, 32);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { pharmacyId, cityId, issueType, message } =
    (body as Record<string, unknown>) ?? {};

  if (
    typeof pharmacyId !== "string" ||
    typeof cityId !== "string" ||
    typeof issueType !== "string" ||
    !VALID_TYPES.includes(issueType as ReportIssueType)
  ) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 422 });
  }

  if (!prisma) {
    return NextResponse.json({ error: "reports_unavailable" }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userIpHash = hashIp(ip);
  const validIssueType = issueType as ReportIssueType;

  try {
    const [city, pharmacy] = await prisma.$transaction([
      prisma.city.findUnique({ where: { id: cityId }, select: { id: true } }),
      prisma.pharmacy.findFirst({
        where: { id: pharmacyId, cityId },
        select: { id: true },
      }),
    ]);

    if (!city || !pharmacy) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const recentReports = await prisma.report.count({
      where: {
        userIpHash,
        createdAt: { gte: new Date(Date.now() - REPORT_WINDOW_MS) },
      },
    });
    if (recentReports >= MAX_REPORTS_PER_WINDOW) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    await prisma.report.create({
      data: {
        pharmacyId,
        cityId,
        issueType: validIssueType,
        message: typeof message === "string" ? message.trim().slice(0, 1000) || null : null,
        userIpHash,
      },
    });
  } catch (error) {
    console.error("[report] Failed to persist report.", error);
    return NextResponse.json({ error: "storage_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
