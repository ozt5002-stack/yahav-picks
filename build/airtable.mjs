import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { AIRTABLE } from './config.mjs';

// Raw Airtable records: from the API, or from a saved JSON file for local work.
export async function loadRecords({ fixture } = {}) {
  if (fixture) {
    const json = JSON.parse(await fs.readFile(fixture, 'utf8'));
    return json.records;
  }
  const token = process.env.AIRTABLE_TOKEN;
  if (!token) throw new Error('AIRTABLE_TOKEN is not set');

  const records = [];
  let offset;
  do {
    const url = new URL(`https://api.airtable.com/v0/${AIRTABLE.baseId}/${AIRTABLE.tableId}`);
    url.searchParams.set('returnFieldsByFieldId', 'true');
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`);
    const page = await res.json();
    records.push(...page.records);
    offset = page.offset;
  } while (offset);
  return records;
}

const text = (v) => (typeof v === 'string' ? v.trim() : '');

/**
 * A link from Airtable goes into an href, and esc() does not stop "javascript:..." (OWASP A05). Only https
 * addresses pass, and only to the hosts given; anything else becomes '' (a buy link then counts as missing,
 * so the product is skipped with a warning instead of being published).
 */
export function safeUrl(v, hosts) {
  try {
    const u = new URL(text(v));
    const host = u.hostname.toLowerCase();
    if (u.protocol !== 'https:') return '';
    if (hosts && !hosts.some((h) => host === h || host.endsWith('.' + h))) return '';
    return u.href;
  } catch { return ''; }
}
const BUY_HOSTS = ['aliexpress.com'];
const REEL_HOSTS = ['instagram.com', 'tiktok.com', 'youtube.com', 'youtu.be', 'facebook.com'];

export function toProduct(record) {
  const f = record.fields;
  const F = AIRTABLE.fields;
  // First image attachment; videos and other files in the same field are ignored.
  const att = Array.isArray(f[F.photo])
    ? f[F.photo].find((a) => (a.type || '').startsWith('image/')) || null
    : null;
  return {
    id: record.id,
    code: f[F.code],
    name: text(f[F.name]),
    published: f[F.status] === AIRTABLE.published,
    link: safeUrl(f[F.link], BUY_HOSTS),
    photo: att ? { id: att.id, url: att.url, type: att.type } : null,
    review: text(f[F.review]),
    category: text(f[F.category]),
    featured: Boolean(f[F.featured]),
    rating: Number(f[F.rating]) || 0,
    pro: text(f[F.pro]),
    con: text(f[F.con]),
    sizeTip: text(f[F.sizeTip]),
    shipping: text(f[F.shipping]),
    reel: safeUrl(f[F.reel], REEL_HOSTS),
    byCustomer: f[F.by] === AIRTABLE.byCustomer,
    customer: text(f[F.customer]),
    created: f[F.created] || record.createdTime,
  };
}

// What a product needs before it may appear on the live site.
// The review is optional (Oz's decision, Nov 2026): without one the card simply has no quote.
export function missingFields(p) {
  const missing = [];
  if (!p.name) missing.push('שם');
  if (!p.link) missing.push('קישור');
  if (!p.photo) missing.push('תמונה');
  if (!p.category) missing.push('קטגוריה');
  return missing;
}

// Fingerprint of everything that shows on the site. Photo URLs rotate every few hours,
// so the attachment id stands in for the photo.
export function fingerprint(products) {
  const stable = products.map(({ photo, ...rest }) => ({ ...rest, photo: photo && photo.id }));
  return crypto.createHash('sha256').update(JSON.stringify(stable)).digest('hex');
}
