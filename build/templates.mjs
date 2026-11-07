import {
  SITE_URL, BASE, SITE_NAME, OWNER, OWNER_TITLE, MAIN_SITE, INSTAGRAM,
  WHATSAPP_DISPLAY, WHATSAPP_NUMBER, BUILDER_WHATSAPP, CATEGORIES,
} from './config.mjs';

export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const href = (p = '') => BASE + p;
const abs = (p = '') => SITE_URL + '/' + p;
const ltr = (s) => `<span dir="ltr">${esc(s)}</span>`;

export const productPath = (p) => `${p.code}/`;
const catOf = (name) => CATEGORIES.find((c) => c.name === name);

const DISCLOSURE_SHORT = 'הקישורים כאן הם קישורי שותפים. אם תקני דרכם, ייתכן שאקבל עמלה.';
const DISCLOSURE_FULL = 'חלק מהקישורים באתר הם קישורי שותפים של AliExpress. אם תקני דרכם, ייתכן שאקבל עמלה.';

const ICONS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>
<symbol id="i-chat" viewBox="0 0 24 24"><path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 9.2c.2 2.6 2.6 5 5.4 5.4l1.1-1.3-1.8-.9-.8.8c-1-.4-1.9-1.3-2.3-2.3l.8-.8-.9-1.8z" fill="currentColor"/></symbol>
<symbol id="i-out" viewBox="0 0 24 24"><path d="M14 5h5v5M19 5l-8 8M17 14v5H5V7h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 11v5M12 8v.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></symbol>
<symbol id="i-star" viewBox="0 0 24 24"><path d="M12 3.8l2.5 5.2 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8z" fill="currentColor"/></symbol>
<symbol id="i-play" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 8.5v7l6-3.5z" fill="currentColor"/></symbol>
<symbol id="i-back" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
</svg>`;

function page({ title, description, path, ogImage, body, ctx, extraHead = '' }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | ${OWNER}`;
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(abs(path))}">
${ctx.preview ? '<meta name="robots" content="noindex">\n' : ''}<meta property="og:type" content="website">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="${esc(SITE_NAME)}">
<meta property="og:title" content="${esc(title || SITE_NAME)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(abs(path))}">
<meta property="og:image" content="${esc(abs(ogImage))}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#E9CECE">
<link rel="icon" href="${href('assets/icon.svg')}" type="image/svg+xml">
<link rel="preload" href="${href('assets/fonts/assistant-hebrew.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${href('assets/styles.css?v=' + ctx.assetVersion)}">
${extraHead}</head>
<body>
<a class="skip" href="#main">דלגי לתוכן</a>
${ctx.preview ? '<div class="preview-bar" role="note">תצוגה מקדימה: כולל טיוטות שעוד לא מופיעות באתר</div>\n' : ''}${ICONS}
${body}
${footer()}
<script src="${href('assets/app.js?v=' + ctx.assetVersion)}" defer></script>
</body>
</html>
`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="wrap footer-inner">
    <p class="footer-disc">${esc(DISCLOSURE_FULL)}</p>
    <p>ההמלצות כאן הן דעה אישית מהניסיון שלי, ואינן ייעוץ מקצועי או רפואי. המחירים והזמינות נקבעים באתר AliExpress ועשויים להשתנות.</p>
    <nav class="footer-links" aria-label="קישורים">
      <a href="${MAIN_SITE}">Fit Balance</a>
      <a href="${INSTAGRAM}">אינסטגרם</a>
      <a href="${href('privacy/')}">מדיניות פרטיות</a>
      <a href="${href('accessibility/')}">הצהרת נגישות</a>
    </nav>
    <p class="credit">האתר נבנה ע״י <a href="https://wa.me/${BUILDER_WHATSAPP}">עוז טרבלסי</a></p>
  </div>
</footer>`;
}

function topBar() {
  return `<header class="topbar">
  <div class="wrap topbar-inner">
    <a class="brand" href="${href()}">${esc(SITE_NAME)}</a>
    <a class="back" href="${href()}">לכל ההמלצות<svg class="ico" aria-hidden="true"><use href="#i-back"/></svg></a>
  </div>
</header>`;
}

function waShare(p) {
  const text = `${p.name}: ההמלצה של יהב\n${abs(productPath(p))}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

function buyButton(p, cls) {
  if (!p.link) return `<span class="${cls} is-missing" aria-disabled="true">חסר קישור</span>`;
  return `<a class="${cls}" href="${esc(p.link)}" target="_blank" rel="sponsored nofollow noopener">לקנייה באליאקספרס<span class="sr-only"> (נפתח בחלון חדש)</span></a>`;
}

function shareButton(p, cls) {
  return `<a class="${cls}" href="${esc(waShare(p))}" target="_blank" rel="noopener" aria-label="שיתוף ${esc(p.name)} בוואטסאפ"><svg class="ico" aria-hidden="true"><use href="#i-chat"/></svg></a>`;
}

function byLine(p) {
  return p.byCustomer
    ? `המלצה של ${esc(p.customer || 'לקוחה')}`
    : 'יהב';
}

function missingNote(p) {
  return p.missing.length ? `<p class="todo">חסר: ${esc(p.missing.join(', '))}</p>` : '';
}

function card(p) {
  const cat = catOf(p.category);
  const img = p.img
    ? `<img src="${href(p.img.square)}" alt="" width="600" height="600" loading="lazy" decoding="async">`
    : `<span class="ph">אין עדיין תמונה</span>`;
  return `<article class="card${p.published ? '' : ' is-draft'}" data-cat="${cat ? cat.slug : ''}" data-name="${esc(p.name.toLowerCase())}" data-code="${p.code}" data-created="${esc(p.created)}">
  <a class="card-media" href="${href(productPath(p))}" tabindex="-1" aria-hidden="true">
    ${img}
    <span class="badges">${p.published ? '' : '<span class="badge draft">טיוטה</span>'}${p.featured ? '<span class="badge">מומלץ</span>' : ''}<span class="badge new" hidden>חדש</span></span>
    <span class="num">${p.code}</span>
  </a>
  <div class="card-body">
    <h2 class="card-title"><a href="${href(productPath(p))}">${esc(p.name)}<span class="sr-only">, מוצר ${p.code}</span></a></h2>
    ${p.review ? `<p class="quote">${esc(p.review)}</p>` : ''}
    ${p.byCustomer ? `<p class="by">${byLine(p)}</p>` : ''}
    ${missingNote(p)}
  </div>
  <div class="card-actions">
    ${buyButton(p, 'buy')}
    ${shareButton(p, 'share')}
  </div>
</article>`;
}

export function indexPage(products, ctx) {
  const used = CATEGORIES.filter((c) => products.some((p) => p.category === c.name));
  const chips = [`<button type="button" class="chip" aria-pressed="true" data-cat="">הכול</button>`]
    .concat(used.map((c) => `<button type="button" class="chip" aria-pressed="false" data-cat="${c.slug}">${esc(c.name)}</button>`))
    .join('');
  const body = `<header class="hero">
  <div class="wrap hero-inner">
    <div class="hero-top"><a class="brand" href="${MAIN_SITE}">Fit Balance</a><span>${esc(SITE_NAME)}</span></div>
    <div class="me">
      <img src="${href(ctx.portrait)}" alt="${esc(OWNER)}" width="120" height="120">
      <div><h1>קניתי. ניסיתי. ממליצה.</h1><p class="me-sub">${esc(OWNER)}, ${esc(OWNER_TITLE)}</p></div>
    </div>
    <p class="hero-text">כל מה שאתן שואלות עליו בסטוריז, במקום אחד. לכל מוצר יש מספר: ראיתן אצלי "מוצר 12"? כתבו 12 בחיפוש.</p>
    <p class="hero-disc"><svg class="ico" aria-hidden="true"><use href="#i-info"/></svg><span>${esc(DISCLOSURE_SHORT)}</span></p>
  </div>
</header>
<main id="main" class="wrap">
  <div class="tools">
    <label class="search" for="q"><svg class="ico" aria-hidden="true"><use href="#i-search"/></svg><span class="sr-only">חיפוש מוצר</span>
      <input id="q" type="search" placeholder="שם מוצר או מספר מהסטורי" autocomplete="off" enterkeyhint="search">
    </label>
    <div class="chips" role="group" aria-label="סינון לפי קטגוריה">${chips}</div>
    <p class="count" id="count" aria-live="polite">${products.length} המלצות</p>
  </div>
  <div class="grid" id="grid">
${products.map(card).join('\n')}
  </div>
  <p class="empty" id="empty" hidden>לא מצאתי מוצר כזה. נסי מילה אחרת, או <button type="button" class="linkish" id="reset">הציגי את כל ההמלצות</button>.</p>
</main>`;
  return page({
    title: '',
    description: `ההמלצות האישיות של ${OWNER}, ${OWNER_TITLE}: מוצרים מאליאקספרס שקניתי והשתמשתי בהם, עם קישור ישיר.`,
    path: '',
    ogImage: ctx.siteOg,
    body,
    ctx,
  });
}

function stars(n) {
  if (!n) return '';
  const icons = Array.from({ length: 5 }, (_, i) =>
    `<svg class="star${i < n ? ' on' : ''}" aria-hidden="true"><use href="#i-star"/></svg>`).join('');
  return `<p class="rating">${icons}<span class="sr-only">דירוג ${n} מתוך 5</span></p>`;
}

export function productPage(p, ctx) {
  const cat = catOf(p.category);
  const media = p.img
    ? `<img src="${href(p.img[1600])}" srcset="${href(p.img[600])} 600w, ${href(p.img[1600])} 1600w" sizes="(min-width: 860px) 460px, 100vw" alt="${esc(p.name)}" width="${p.img.width}" height="${p.img.height}" fetchpriority="high">`
    : `<span class="ph">אין עדיין תמונה</span>`;
  const details = [
    p.pro && ['מה אהבתי', p.pro],
    p.con && ['מה פחות', p.con],
    p.sizeTip && ['טיפ למידות', p.sizeTip],
    p.shipping && [p.byCustomer ? 'זמן משלוח' : 'זמן משלוח אצלי', p.shipping],
  ].filter(Boolean);
  const body = `${topBar()}
<main id="main" class="wrap product${p.published ? '' : ' is-draft'}" data-created="${esc(p.created)}">
  <div class="product-media">${media}<span class="num">${p.code}</span></div>
  <div class="product-info">
    <p class="eyebrow">מוצר ${p.code}${cat ? ` · <a href="${href('?c=' + cat.slug)}">${esc(cat.name)}</a>` : ''}</p>
    <h1>${esc(p.name)}</h1>
    <p class="badges inline">${p.published ? '' : '<span class="badge draft">טיוטה</span>'}${p.featured ? '<span class="badge">מומלץ</span>' : ''}<span class="badge new" hidden>חדש</span></p>
    ${p.review ? `<figure class="review"><blockquote><p>${esc(p.review)}</p></blockquote><figcaption>${byLine(p)}</figcaption></figure>` : ''}
    ${stars(p.rating)}
    ${details.length ? `<dl class="details">${details.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
    ${p.reel ? `<p><a class="reel" href="${esc(p.reel)}" target="_blank" rel="noopener"><svg class="ico" aria-hidden="true"><use href="#i-play"/></svg>לצפייה בסרטון של המוצר<span class="sr-only"> (נפתח בחלון חדש)</span></a></p>` : ''}
    ${missingNote(p)}
    <div class="product-actions">
      ${buyButton(p, 'buy big')}
      ${shareButton(p, 'share big')}
    </div>
    <p class="small-disc">${esc(DISCLOSURE_SHORT)} המחיר נקבע באליאקספרס ועשוי להשתנות.</p>
  </div>
</main>`;
  return page({
    title: p.name,
    description: p.review ? truncate(p.review, 150) : `ההמלצה של ${OWNER}`,
    path: productPath(p),
    ogImage: p.img ? p.img.og : ctx.siteOg,
    body,
    ctx,
  });
}

const truncate = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

function prosePage({ title, path, html, ctx }) {
  return page({
    title,
    description: `${title}: ${SITE_NAME}`,
    path,
    ogImage: ctx.siteOg,
    body: `${topBar()}\n<main id="main" class="wrap prose">\n<h1>${esc(title)}</h1>\n${html}\n</main>`,
    ctx,
  });
}

export function privacyPage(ctx) {
  return prosePage({
    title: 'מדיניות פרטיות',
    path: 'privacy/',
    ctx,
    html: `<p class="updated">עודכן: ${ctx.updated}</p>
<p>האתר הזה שייך ל-Fit Balance, העסק של ${OWNER}, ${OWNER_TITLE}. כאן כתוב איזה מידע נאסף כשאת גולשת באתר ההמלצות, ומה קורה כשאת לוחצת על קישור.</p>
<h2>איזה מידע נאסף</h2>
<p>באתר ההמלצות אין טפסים, אין הרשמה, ואין עוגיות (cookies) או כלי סטטיסטיקה שלי. אני לא אוספת עלייך שום פרט אישי.</p>
<p>שרתי האחסון של האתר (GitHub Pages, של חברת GitHub) עשויים לרשום מידע טכני כמו כתובת IP וסוג הדפדפן, לצורכי אבטחה ותפעול. המידע הזה נשמר אצלם ולפי מדיניות הפרטיות שלהם.</p>
<p>הגופנים והתמונות נטענים מהאתר עצמו ולא משירותים חיצוניים.</p>
<h2>קישורים לאליאקספרס</h2>
<p>${esc(DISCLOSURE_FULL)} כשאת לוחצת על "לקנייה", את עוברת לאתר AliExpress. הם עשויים לשמור עוגייה כדי לדעת שהגעת דרך הקישור שלי, ומשם והלאה חלה מדיניות הפרטיות של AliExpress. אני רואה רק נתונים כלליים על לחיצות והזמנות, ולא את השם או פרטי הקשר של מי שקנתה.</p>
<h2>שיתוף בוואטסאפ וסרטונים</h2>
<p>כפתור השיתוף פותח את וואטסאפ עם קישור למוצר. קישורי הסרטונים מובילים לאינסטגרם או לטיקטוק. בשני המקרים חלה מדיניות הפרטיות של אותו שירות.</p>
<h2>יצירת קשר</h2>
<p>שאלה על הפרטיות? שלחי הודעה בוואטסאפ ל-${ltr(WHATSAPP_DISPLAY)}.</p>`,
  });
}

export function accessibilityPage(ctx) {
  return prosePage({
    title: 'הצהרת נגישות',
    path: 'accessibility/',
    ctx,
    html: `<p class="updated">עודכן: ${ctx.updated}</p>
<p>חשוב לי שכל אחת תוכל להשתמש באתר בנוחות, כולל נשים עם מוגבלות.</p>
<h2>מעמד העסק</h2>
<p>Fit Balance הוא עסק של עוסקת פטורה, ולפי תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות) הוא פטור מחובת הנגשת שירותי אינטרנט. למרות זאת, האתר נבנה מתוך כוונה להיות נגיש ככל האפשר.</p>
<h2>מה נעשה באתר</h2>
<ul>
<li>האתר בנוי בקוד תקני, בעברית ומימין לשמאל, ומותאם לנייד ולמחשב.</li>
<li>אפשר לנווט בכל האתר עם המקלדת, ויש סימון ברור לרכיב שנבחר. יש קישור "דלגי לתוכן" בתחילת כל עמוד.</li>
<li>לכל תמונת מוצר יש טקסט חלופי עם שם המוצר.</li>
<li>לשדה החיפוש יש תווית, ותוצאות הסינון מוקראות לקוראי מסך.</li>
<li>הטקסט בגודל קריא, ואפשר להגדיל אותו בדפדפן בלי שהאתר יישבר.</li>
<li>ניגודיות הצבעים בטקסט נבדקה.</li>
<li>האתר מכבד את הגדרת "הפחתת תנועה" במכשיר.</li>
</ul>
<h2>מה לא בשליטתי</h2>
<ul>
<li>דפי המוצרים באליאקספרס, והסרטונים באינסטגרם ובטיקטוק, הם אתרים חיצוניים, ורמת הנגישות שלהם לא תלויה בי.</li>
<li>לסרטוני המוצרים אין כרגע כתוביות.</li>
</ul>
<h2>נתקלת בבעיה?</h2>
<p>אם משהו באתר לא נגיש לך, או שאת צריכה עזרה, שלחי הודעה בוואטסאפ ל-${ltr(WHATSAPP_DISPLAY)} ואחזור אלייך.</p>
<p><a href="https://wa.me/${WHATSAPP_NUMBER}">לשליחת הודעה בוואטסאפ</a></p>`,
  });
}

export function notFoundPage(ctx) {
  return page({
    title: 'הדף לא נמצא',
    description: SITE_NAME,
    path: '404.html',
    ogImage: ctx.siteOg,
    body: `${topBar()}\n<main id="main" class="wrap prose">\n<h1>הדף הזה לא נמצא</h1>\n<p>אולי המוצר הוסר, או שהמספר לא נכון. אפשר לחפש אותו <a href="${href()}">בכל ההמלצות</a>.</p>\n</main>`,
    ctx,
  });
}
