/**
 * URL de la base, quel que soit le nom donné par l'intégration Vercel (Neon, Vercel Postgres,
 * avec ou sans préfixe personnalisé, ex. STORAGE_DATABASE_URL). Même logique que scripts/build.mjs.
 */
const POOLED = /(^|_)(DATABASE_URL|POSTGRES_PRISMA_URL|POSTGRES_URL)$/;

export function databaseUrl(env: NodeJS.ProcessEnv = process.env): string | undefined {
  if (env.DATABASE_URL) return env.DATABASE_URL;
  const key = Object.keys(env)
    .filter((k) => POOLED.test(k) && env[k])
    .sort((a, b) => a.length - b.length)[0];
  return key ? env[key] : undefined;
}
