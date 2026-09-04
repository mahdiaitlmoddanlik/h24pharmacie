"use server";

import type { ReportStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const REPORT_STATUSES: ReportStatus[] = ["new", "reviewed", "resolved", "rejected"];

export async function updateReportStatus(formData: FormData) {
  await assertAdmin();
  if (!prisma) throw new Error("Database is unavailable.");

  const id = formData.get("id");
  const status = formData.get("status");
  if (
    typeof id !== "string" ||
    typeof status !== "string" ||
    !REPORT_STATUSES.includes(status as ReportStatus)
  ) {
    throw new Error("Invalid report update.");
  }

  await prisma.report.update({
    where: { id },
    data: { status: status as ReportStatus },
  });
  revalidatePath("/admin/reports");
}
