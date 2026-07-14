// Generates public/sitemap.xml and public/rss.xml from published posts.
// Usage: `node scripts/generate-seo.mjs` (reads VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY).
import { writeFileSync } from 'node:fs';
import { config } from 'dotenv';
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SITE_URL = (process.env.SITE_URL || '').replace(/\/$/, '');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY.');
  process.exit(1);
}

async function fetchAll(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

const [posts, categories] = await Promise.all([
  fetchAll('posts?select=slug,title,excerpt,published_at,updated_at&status=eq.published&order=published_at.desc'),
  fetchAll('categories?select=slug'),
]);

const STATIC = ['/', '/about', '/blog', '/guides', '/download', '/faq', '/contact', '/privacy', '/terms', '/disclaimer'];
const abs = (p) => SITE_URL ? `${SITE_URL}${p}` : p;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC.map((u) => `  <url><loc>${abs(u)}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
${categories.map((c) => `  <url><loc>${abs(`/category/${c.slug}`)}</loc><changefreq>weekly</changefreq></url>`).join('\n')}
${posts.map((p) => `  <url><loc>${abs(`/blog/${p.slug}`)}</loc><lastmod>${(p.updated_at || p.published_at || '').slice(0, 10)}</lastmod></url>`).join('\n')}
</urlset>
`;
writeFileSync('public/sitemap.xml', sitemap);

const esc = (s = '') => s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>NoThanks — Consumer Guides</title>
<link>${SITE_URL || '/'}</link>
<description>Guides, product insights, and consumer education.</description>
<language>en</language>
${posts.map((p) => `<item>
  <title>${esc(p.title)}</title>
  <link>${abs(`/blog/${p.slug}`)}</link>
  <guid>${abs(`/blog/${p.slug}`)}</guid>
  <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
  <description>${esc(p.excerpt || '')}</description>
</item>`).join('\n')}
</channel></rss>
`;
writeFileSync('public/rss.xml', rss);

console.log(`Wrote sitemap.xml (${posts.length + categories.length + STATIC.length} urls) and rss.xml (${posts.length} items).`);
