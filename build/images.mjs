import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

// Airtable photo URLs expire after a few hours, so every photo is downloaded at build time
// and served from the site itself. Downloads and resized files are cached by attachment id,
// so a rebuild only processes new photos.
const CACHE = '.cache/img';
const SIZES = [600, 1600];
const OG_MAX_BYTES = 300 * 1024; // WhatsApp skips heavier preview images

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function source(photo) {
  const file = path.join(CACHE, `${photo.id}.src`);
  if (!(await exists(file))) {
    const res = await fetch(photo.url);
    if (!res.ok) throw new Error(`photo ${photo.id}: HTTP ${res.status}`);
    await fs.writeFile(file, Buffer.from(await res.arrayBuffer()));
  }
  return file;
}

async function cached(name, make) {
  const file = path.join(CACHE, name);
  if (!(await exists(file))) await fs.writeFile(file, await make());
  return file;
}

async function ogJpeg(src) {
  for (const quality of [80, 70, 60, 50]) {
    const buf = await sharp(src).rotate().resize(1200, 630, { fit: 'cover' })
      .jpeg({ quality, mozjpeg: true }).toBuffer();
    if (buf.length <= OG_MAX_BYTES) return buf;
  }
  return sharp(src).rotate().resize(1000, 525, { fit: 'cover' }).jpeg({ quality: 50, mozjpeg: true }).toBuffer();
}

// Writes the photo in every size into outDir/img and returns their site paths (without BASE).
export async function processPhoto(photo, key, outDir) {
  await fs.mkdir(CACHE, { recursive: true });
  await fs.mkdir(path.join(outDir, 'img'), { recursive: true });
  const src = await source(photo);
  const tag = photo.id.slice(-6).toLowerCase();
  const out = {};

  for (const w of SIZES) {
    const name = `${key}-${tag}-${w}.jpg`;
    const file = await cached(name, () =>
      sharp(src).rotate().resize({ width: w, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toBuffer());
    await fs.copyFile(file, path.join(outDir, 'img', name));
    out[w] = `img/${name}`;
  }
  const square = `${key}-${tag}-sq.jpg`;
  const sqFile = await cached(square, () =>
    sharp(src).rotate().resize(600, 600, { fit: 'cover' }).jpeg({ quality: 80, mozjpeg: true }).toBuffer());
  await fs.copyFile(sqFile, path.join(outDir, 'img', square));
  out.square = `img/${square}`;

  const og = `${key}-${tag}-og.jpg`;
  const ogFile = await cached(og, () => ogJpeg(src));
  await fs.copyFile(ogFile, path.join(outDir, 'img', og));
  out.og = `img/${og}`;

  const meta = await sharp(path.join(outDir, 'img', `${key}-${tag}-1600.jpg`)).metadata();
  out.width = meta.width;
  out.height = meta.height;
  return out;
}

// Site photos that ship with the repo (Yahav's portrait), in the same formats.
export async function processLocal(file, key, outDir) {
  await fs.mkdir(path.join(outDir, 'img'), { recursive: true });
  const portrait = `img/${key}-240.jpg`;
  await sharp(file).rotate().resize(240, 240, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(outDir, portrait));
  const og = `img/${key}-og.jpg`;
  await fs.writeFile(path.join(outDir, og), await ogJpeg(file));
  return { portrait, og };
}
