/**
 * npm run build (Vercel) : prisma generate → prisma migrate deploy → next build
 *
 * - Trouve l'URL de la base quel que soit le nom donné par l'intégration (Neon, Vercel Postgres,
 *   préfixe personnalisé comme STORAGE_DATABASE_URL…). Même logique que lib/db-url.ts.
 * - Sans base reliée, le site est quand même publié (seules les confirmations RSVP ne pourront
 *   pas être enregistrées) et le journal explique quoi faire.
 */
import { execSync } from "node:child_process";

const env = process.env;
const POOLED = /(^|_)(DATABASE_URL|POSTGRES_PRISMA_URL|POSTGRES_URL)$/;
const DIRECT = /(^|_)(DATABASE_URL_UNPOOLED|POSTGRES_URL_NON_POOLING|DIRECT_URL)$/;

const pick = (re) =>
  Object.keys(env)
    .filter((k) => re.test(k) && env[k])
    .sort((a, b) => a.length - b.length)[0];

const pooledKey = env.DATABASE_URL ? "DATABASE_URL" : pick(POOLED);
const run = (cmd) => execSync(cmd, { stdio: "inherit", env });

if (pooledKey) {
  const pooled = env[pooledKey];
  const directKey = env.DATABASE_URL_UNPOOLED ? "DATABASE_URL_UNPOOLED" : pick(DIRECT);
  env.DATABASE_URL = pooled;
  // Neon : l'hôte direct est l'hôte « pooler » sans le suffixe « -pooler »
  env.DATABASE_URL_UNPOOLED = directKey ? env[directKey] : pooled.replace("-pooler.", ".");
  console.log(`✓ Base de données : ${pooledKey}${directKey ? ` (migrations via ${directKey})` : ""}`);
  run("prisma generate");
  run("prisma migrate deploy");
} else {
  const hints = Object.keys(env).filter((k) => /DATABASE|POSTGRES|NEON|^PG/i.test(k));
  console.warn(
    [
      "",
      "⚠ Aucune base de données trouvée : le site est publié, mais les confirmations RSVP",
      "  ne pourront pas être enregistrées tant qu'une base n'est pas reliée.",
      `  Environnement Vercel : ${env.VERCEL_ENV ?? "local"}${env.VERCEL_GIT_COMMIT_REF ? ` (branche ${env.VERCEL_GIT_COMMIT_REF})` : ""}`,
      `  Variables liées à une base vues pendant le build : ${hints.length ? hints.join(", ") : "aucune"}`,
      "  → Vercel : Storage → votre base Neon → Connect Project → cocher Production ET Preview → Redeploy.",
      "",
    ].join("\n"),
  );
  // URL factice : uniquement pour générer le client Prisma, aucune connexion n'est tentée
  env.DATABASE_URL = env.DATABASE_URL_UNPOOLED = "postgresql://build:build@localhost:5432/build";
  run("prisma generate");
}

run("next build");
