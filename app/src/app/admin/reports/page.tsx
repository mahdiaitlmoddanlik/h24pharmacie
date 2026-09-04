import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { updateReportStatus } from "./actions";

export const dynamic = "force-dynamic";

const statusLabels = {
  new: "Nouveau",
  reviewed: "Examiné",
  resolved: "Résolu",
  rejected: "Rejeté",
} as const;

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  if (!isAdminConfigured()) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-2xl font-extrabold text-foreground">Rapports</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Définissez ADMIN_REPORT_TOKEN dans les variables d&apos;environnement pour activer cet espace privé.
        </p>
      </main>
    );
  }

  if (!(await isAdminAuthenticated())) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-2xl font-extrabold text-foreground">Rapports</h1>
        <form action="/api/admin/reports/auth" method="post" className="mt-6 space-y-4">
          <label htmlFor="admin-token" className="block text-sm font-semibold text-foreground">
            Code administrateur
          </label>
          <input
            id="admin-token"
            name="token"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-card border border-border bg-surface px-3 py-2.5 text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
          />
          {error === "invalid" && (
            <p className="text-sm font-medium text-danger">Code administrateur invalide.</p>
          )}
          <button
            type="submit"
            className="rounded-card bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark"
          >
            Ouvrir les rapports
          </button>
        </form>
      </main>
    );
  }

  if (!prisma) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="text-2xl font-extrabold text-foreground">Rapports</h1>
        <p className="mt-3 text-sm text-muted">La base de données est actuellement indisponible.</p>
      </main>
    );
  }

  const reports = await prisma.report.findMany({
    include: {
      pharmacy: { select: { name: true } },
      city: { select: { nameFr: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Rapports</h1>
          <p className="mt-1 text-sm text-muted">{reports.length} rapport(s) récents</p>
        </div>
        <form action="/api/admin/reports/logout" method="post">
          <button type="submit" className="text-sm font-semibold text-muted hover:text-danger">
            Déconnexion
          </button>
        </form>
      </div>

      <div className="mt-8 overflow-x-auto border border-border bg-surface">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-muted text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Pharmacie</th>
              <th className="px-4 py-3">Problème</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="whitespace-nowrap px-4 py-3 text-muted">
                  {new Intl.DateTimeFormat("fr-MA", {
                    dateStyle: "short",
                    timeStyle: "short",
                    timeZone: "Africa/Casablanca",
                  }).format(report.createdAt)}
                </td>
                <td className="px-4 py-3 font-semibold text-foreground">
                  {report.pharmacy?.name ?? "Pharmacie supprimée"}
                  <span className="block text-xs font-normal text-muted">{report.city?.nameFr ?? "Ville inconnue"}</span>
                </td>
                <td className="px-4 py-3 text-foreground">{report.issueType}</td>
                <td className="max-w-sm px-4 py-3 text-muted">{report.message ?? "-"}</td>
                <td className="px-4 py-3">
                  <form action={updateReportStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={report.id} />
                    <select
                      name="status"
                      defaultValue={report.status}
                      className="rounded-card border border-border bg-surface px-2 py-1.5 text-sm text-foreground"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="text-sm font-semibold text-primary-dark hover:text-primary">
                      Enregistrer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Aucun rapport pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
