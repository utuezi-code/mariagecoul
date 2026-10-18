/**
 * npm run optimize-images [dossier-source]
 *
 * 1. Déposez les photos brutes (JPG, PNG, HEIC converties…) dans `photos-brutes/` (non versionné).
 * 2. Lancez `npm run optimize-images`.
 * 3. Les fichiers optimisés arrivent dans `public/images/` (WebP + AVIF, 2400 px max).
 * 4. Le script affiche les lignes prêtes à coller dans `content/site.ts` (avec blurDataURL).
 */
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import sharp from "sharp";

const SRC = process.argv[2] ?? "photos-brutes";
const OUT = "public/images";
const MAX = 2400;
const TARGET_KB = 300;
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".avif", ".heic", ".heif"]);

const slug = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function encodeUnder(pipeline, format) {
  // baisse la qualité jusqu'à passer sous ~300 Ko
  for (const quality of [82, 75, 68, 60, 52]) {
    const buf = await pipeline.clone()[format]({ quality, effort: format === "avif" ? 5 : 5 }).toBuffer();
    if (buf.length / 1024 <= TARGET_KB || quality === 52) return { buf, quality };
  }
}

async function main() {
  let files;
  try {
    files = (await readdir(SRC)).filter((f) => EXT.has(extname(f).toLowerCase()));
  } catch {
    console.error(`Dossier introuvable : ${SRC}/ — créez-le et déposez-y les photos.`);
    process.exit(1);
  }
  if (!files.length) {
    console.error(`Aucune image dans ${SRC}/`);
    process.exit(1);
  }
  await mkdir(OUT, { recursive: true });

  const manifest = [];
  for (const file of files) {
    const name = slug(basename(file, extname(file)));
    const input = sharp(join(SRC, file)).rotate(); // respecte l'orientation EXIF
    const resized = input.resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true });
    const { info } = await resized.clone().toBuffer({ resolveWithObject: true });

    const webp = await encodeUnder(resized, "webp");
    const avif = await encodeUnder(resized, "avif");
    await writeFile(join(OUT, `${name}.webp`), webp.buf);
    await writeFile(join(OUT, `${name}.avif`), avif.buf);

    const blur = await sharp(join(SRC, file)).rotate().resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
    const entry = {
      src: `/images/${name}.webp`,
      alt: "TODO_MARIES — description de la photo",
      width: info.width,
      height: info.height,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    };
    manifest.push(entry);
    const before = (await stat(join(SRC, file))).size / 1024;
    console.log(
      `✓ ${file} → ${name}.webp (${Math.round(webp.buf.length / 1024)} Ko) + .avif (${Math.round(avif.buf.length / 1024)} Ko) — origine ${Math.round(before)} Ko, ${info.width}×${info.height}`,
    );
  }

  await writeFile(join(OUT, "_manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("\nÀ coller dans content/site.ts → media (hero / story / gallery) :\n");
  for (const m of manifest) console.log(JSON.stringify(m) + ",");
  console.log(`\n(Également enregistré dans ${OUT}/_manifest.json)`);
}

main();
