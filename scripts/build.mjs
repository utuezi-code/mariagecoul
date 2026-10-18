/**
 * npm run build (Vercel) : prisma generate → prisma migrate deploy → next build
 *
 * Trouve l'URL de connexion directe (sans pooler) attendue par prisma/schema.prisma,
 * quel que soit le nom donné par l'intégration Neon / Vercel Postgres.
 */
import { execSync } from "node:child_process";

const env = process.env;

const pooled = env.DATABASE_URL || env.POSTGRES_PRISMA_URL || env.POSTGRES_URL;
if (!pooled) {
  console.error(
    "\n✗ Aucune base de données trouvée (DATABASE_URL absente).\n" +
      "  Vercel → projet → Storage → créer/relier une base Neon, puis Redeploy.\n",
  );
  process.exit(1);
}
env.DATABASE_URL = pooled;

// Neon : l'hôte direct est l'hôte « pooler » sans le suffixe « -pooler »
const direct =
  env.DATABASE_URL_UNPOOLED ||
  env.POSTGRES_URL_NON_POOLING ||
  env.DIRECT_URL ||
  pooled.replace("-pooler.", ".");
env.DATABASE_URL_UNPOOLED = direct;

const run = (cmd) => execSync(cmd, { stdio: "inherit", env });
run("prisma generate");
run("prisma migrate deploy");
run("next build");
