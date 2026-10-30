import type { Metadata } from "next";
import { Download, LogOut, Search } from "lucide-react";
import { site } from "@/content/site";
import { isAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseSide } from "@/lib/sides";
import { remainingPlaces, type Places } from "@/lib/places";
import { Monogram } from "@/components/ui/Monogram";
import { login, logout } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: `Admin — ${site.identity.monogram}`, robots: { index: false, follow: false } };

const a = site.admin;

function Login({ error }: { error: boolean }) {
  const configured = !!process.env.ADMIN_PASSWORD;
  return (
    <main className="flex min-h-dvh items-center justify-center bg-champagne px-5">
      <form action={login} className="w-full max-w-sm border border-gold/30 bg-ivory px-8 py-10 text-center">
        <Monogram className="mx-auto h-16 w-16" tone="light" />
        <h1 className="mt-6 font-display text-3xl text-ink">{a.loginTitle}</h1>
        {!configured && <p className="mt-4 text-sm text-[#a33a2a]">{a.notConfigured}</p>}
        <label htmlFor="password" className="eyebrow mt-8 block text-left !text-[0.65rem] text-mist-deep">
          {a.password}
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field" />
        {error && (
          <p role="alert" className="mt-3 text-left text-sm text-[#a33a2a]">
            {a.wrongPassword}
          </p>
        )}
        <button type="submit" className="btn-gold mt-8 w-full">
          {a.login}
        </button>
      </form>
    </main>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cote?: string; erreur?: string }>;
}) {
  const { q = "", cote = "", erreur } = await searchParams;
  if (!(await isAdmin())) return <Login error={!!erreur} />;

  const query = q.trim();
  let rows: Awaited<ReturnType<typeof prisma.rsvp.findMany>> = [];
  let all: typeof rows = [];
  let dbError = false;
  let left: Places | null = null;
  try {
    left = await remainingPlaces();
    all = await prisma.rsvp.findMany({ orderBy: { createdAt: "desc" } });
    rows = all
      .filter((r) => !query || `${r.name} ${r.phone}`.toLowerCase().includes(query.toLowerCase()))
      .filter((r) => !cote || (cote === "none" ? !parseSide(r.side) : r.side === cote));
  } catch (e) {
    console.error(e);
    dbError = true;
  }

  const yes = all.filter((r) => r.attending);
  const sum = (list: typeof all) => list.reduce((n, r) => n + r.guests, 0);
  const totals = [
    { label: a.totals.yes, value: yes.length },
    { label: a.totals.no, value: all.length - yes.length },
    { label: a.totals.people, value: sum(yes) },
    { label: a.totals.ceremony, value: sum(yes.filter((r) => r.events === "ceremonie" || r.events === "les-deux")) },
    { label: a.totals.reception, value: sum(yes.filter((r) => r.events === "reception" || r.events === "les-deux")) },
  ];
  const sideKey = (s: string | null) => parseSide(s) ?? "none";
  const bySide = (["m", "mme", "none"] as const).map((k) => {
    const list = yes.filter((r) => sideKey(r.side) === k);
    const cap = k === "none" ? null : site.rsvp.places.capacity[k];
    return { key: k, label: a.sides[k], yes: list.length, people: sum(list), left: k === "none" || !left ? null : left[k], cap };
  });
  const ev = site.rsvp.form.eventsOptions as Record<string, string>;
  const dateFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: site.identity.timezone, dateStyle: "short", timeStyle: "short" });

  return (
    <main className="min-h-dvh bg-ivory px-4 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Monogram className="h-12 w-12" tone="light" />
            <h1 className="font-display text-3xl text-ink md:text-4xl">{a.title}</h1>
          </div>
          <div className="flex gap-3">
            <a href="/api/admin/export" className="btn-outline text-ink hover:border-gold-ink hover:bg-gold-ink hover:text-white">
              <Download className="h-4 w-4" strokeWidth={1.25} aria-hidden="true" />
              {a.export}
            </a>
            <form action={logout}>
              <button type="submit" className="btn-outline text-mist-deep hover:text-ink">
                <LogOut className="h-4 w-4" strokeWidth={1.25} aria-hidden="true" />
                {a.logout}
              </button>
            </form>
          </div>
        </header>

        {dbError && <p className="mt-6 border border-[#a33a2a]/40 bg-white p-4 text-[#a33a2a]">{a.dbError}</p>}

        <dl className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
          {totals.map((t) => (
            <div key={t.label} className="border border-gold/30 bg-white p-4">
              <dt className="eyebrow !text-[0.6rem] !tracking-[0.2em] text-mist-deep">{t.label}</dt>
              <dd className="mt-2 font-display text-4xl text-ink">{t.value}</dd>
            </div>
          ))}
        </dl>

        <p className="eyebrow mt-8 !text-[0.65rem] text-gold-ink">{a.bySide}</p>
        <dl className="mt-3 grid gap-3 md:grid-cols-3">
          {bySide.map((s) => (
            <div key={s.key} className="border border-gold/30 bg-white p-4">
              <dt className="eyebrow !text-[0.6rem] !tracking-[0.2em] text-mist-deep">{s.label}</dt>
              <dd className="mt-2 font-display text-2xl text-ink">
                {s.yes} {a.sideStats.yes} · {s.people} {s.people > 1 ? a.sideStats.people : a.sideStats.person}
              </dd>
              {s.left !== null && (
                <dd className="mt-1 text-sm text-gold-ink">
                  {s.left} {a.sideStats.remaining} {s.cap}
                </dd>
              )}
            </div>
          ))}
        </dl>

        <form className="mt-8 flex max-w-2xl flex-wrap gap-2" role="search">
          <label htmlFor="q" className="sr-only">
            {a.search}
          </label>
          <input id="q" name="q" defaultValue={query} placeholder={a.search} className="field min-w-[14rem] flex-1" />
          <label htmlFor="cote" className="sr-only">
            {a.sideFilter}
          </label>
          <select id="cote" name="cote" defaultValue={cote} className="field w-auto cursor-pointer">
            <option value="">
              {a.sideFilter} : {a.sideAll}
            </option>
            <option value="m">{a.sides.m}</option>
            <option value="mme">{a.sides.mme}</option>
            <option value="none">{a.sides.none}</option>
          </select>
          <button type="submit" className="btn-outline text-ink" aria-label={a.searchButton}>
            <Search className="h-4 w-4" strokeWidth={1.25} aria-hidden="true" />
          </button>
        </form>

        <div className="mt-6 overflow-x-auto border border-ink/10 bg-white">
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead className="bg-gold-ink text-white">
              <tr>
                {Object.values(a.columns).map((c) => (
                  <th key={c} scope="col" className="eyebrow px-4 py-3 !text-[0.6rem] !tracking-[0.2em]">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-mist-deep">
                    {a.empty}
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="align-top">
                    <td className="px-4 py-3 font-medium text-ink">{r.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}`} className="underline decoration-gold/50 underline-offset-4" target="_blank" rel="noopener noreferrer">
                        {r.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span className={r.attending ? "text-gold-ink" : "text-mist-deep"}>{r.attending ? a.totals.yes : a.totals.no}</span>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{r.attending ? r.guests : "—"}</td>
                    <td className="px-4 py-3">{r.events ? (ev[r.events] ?? r.events) : "—"}</td>
                    <td className="max-w-xs px-4 py-3 whitespace-pre-line text-graphite">{r.message ?? ""}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{a.sides[sideKey(r.side)]}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-mist-deep">{dateFmt.format(r.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
