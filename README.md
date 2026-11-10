# ההמלצות של יהב

Personal AliExpress recommendations site for Yahav Sror (Fit Balance).
Hebrew, RTL, mobile first. Static HTML, built from Airtable, hosted on GitHub Pages.

## How it works

```
Airtable (base "ההמלצות של יהב", table "מוצרים")
   │  hourly GitHub Action (.github/workflows/site.yml)
   ▼
build/build.mjs  → downloads + compresses photos (sharp, cached in .cache/)
                 → writes dist/: index, one page per product (/<number>/), privacy, accessibility
   │  only if the published data changed (fingerprint in data/last-hash.txt)
   ▼
GitHub Pages
```

- Only rows with status **מפורסם** and a name, link, photo and category go live (the short review is optional).
  Published rows with something missing are skipped and listed in the Action log.
- Airtable photo URLs expire, so photos are never hot-linked.
- "New" badge (14 days) is computed in the browser, no rebuild needed.
- Product URL = the Airtable auto number, e.g. `/12/` = "מוצר 12" in stories.
- To publish right away: Actions tab → Site → Run workflow.

## Setup (one time)

1. Airtable personal access token, scope `data.records:read`, access to this base only.
2. Repo Settings → Secrets and variables → Actions:
   - secret `AIRTABLE_TOKEN`
   - variable `SITE_URL` (now `https://ozt5002-stack.github.io/yahav-picks`, later `https://picks.fit-balance.co.il`)
3. Custom domain: Netlify DNS → add CNAME `picks` → `ozt5002-stack.github.io`; then repo Settings → Pages → Custom domain `picks.fit-balance.co.il`, Enforce HTTPS; then change `SITE_URL`.

## Local work

```
npm install
npm run preview        # builds from data/fixture.json, drafts included, noindex
node build/serve.mjs   # http://localhost:4173
```

`hub/links/index.html` is the Instagram bio page. It belongs in the main site repo
(`fit-balance/fit-balance-site/links/index.html`), not here.

## Content rules

- Yahav is "מאמנת כושר ואורח חיים בריא". Never dietitian / nutritionist.
- No invented reviews, ratings or claims. No prices. No health claims.
- WhatsApp prefilled text: no emoji.
- Buy links: `target="_blank" rel="sponsored nofollow noopener"`, affiliate link only.
