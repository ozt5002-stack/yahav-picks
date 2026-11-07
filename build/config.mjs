// Everything that is specific to this site lives here.
// Moving to a standalone domain later = change SITE_URL (env var in the workflow).

const rawUrl = process.env.SITE_URL || 'https://picks.fit-balance.co.il';
export const SITE_URL = rawUrl.replace(/\/+$/, '');
// Path prefix when the site is not at the domain root (e.g. github.io/yahav-picks)
export const BASE = new URL(SITE_URL + '/').pathname;

export const SITE_NAME = 'ההמלצות של יהב';
export const OWNER = 'יהב סרור';
export const OWNER_TITLE = 'מאמנת כושר ואורח חיים בריא';
export const MAIN_SITE = 'https://fit-balance.co.il/';
export const INSTAGRAM = 'https://www.instagram.com/yahav.sror/';
export const WHATSAPP_DISPLAY = '058-563-7393';
export const WHATSAPP_NUMBER = '972585637393';
export const BUILDER_WHATSAPP = '972545224056';

// Days a product counts as "new" after it was added in Airtable
export const NEW_DAYS = 14;

export const AIRTABLE = {
  baseId: 'appaC7xzoa41MAB94',
  tableId: 'tblKJ3uM1MkZPGJzc',
  fields: {
    name: 'fldsRuFXNOSlGssLI',
    code: 'fldyLtURMuIeDAkWU',
    status: 'fldFVBf1YtHZx4lsk',
    link: 'fldXxwbp2jzFw7MFJ',
    photo: 'fldPoE7af2OLo6gr2',
    review: 'fldcxcR2ZwZZf41LK',
    category: 'fldUkxxIxReruyjhs',
    featured: 'fldFFJyuDUGVdqcv7',
    rating: 'fldPzcFzIMAJmFWyc',
    pro: 'fldyxaH92XsvXXekn',
    con: 'fldi88IUi1LeQ7FQM',
    sizeTip: 'flduq1tWUJFwuOhhA',
    shipping: 'fld7GrKfk27kpTFqU',
    reel: 'fldprrx6PCElokWa0',
    by: 'fldz6DJrp1px6eY90',
    customer: 'fldGu2B0nhze9lw05',
    created: 'fld6bQz75fSneOXft',
  },
  published: 'מפורסם',
  byCustomer: 'לקוחה',
};

// Fixed list, in display order. slug is used in ?c= links.
export const CATEGORIES = [
  { name: 'כושר ואימונים', slug: 'fitness' },
  { name: 'תזונה ומטבח', slug: 'kitchen' },
  { name: 'מקרר, סדר וארגון', slug: 'organizing' },
  { name: 'אימהות ותינוקות', slug: 'moms' },
  { name: 'היריון ואחרי לידה', slug: 'pregnancy' },
  { name: 'אופנה וטיפוח', slug: 'fashion' },
  { name: 'לייף סטייל ובית', slug: 'home' },
  { name: "גאדג'טים ליוצרות תוכן", slug: 'creators' },
  { name: 'שונות', slug: 'other' },
];
