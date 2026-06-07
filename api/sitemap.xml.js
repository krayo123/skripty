const SITE_URL = 'https://krayoskriptz.vercel.app';
const SUPABASE_URL = 'https://vwiwgbvtkjyerqpjbkfc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6InZ3aXdnYnZ0a2p5ZXJxcGpia2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTg5NjIsImV4cCI6MjA5NjE3NDk2Mn0.uqMgkZTVOm0NmU54HSlQe33BeAfYxFPj5xzA_IfsXB8';

function escapeXml(value) {
  return String(value).replace(/[<>&'"]/g, (char) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  })[char]);
}

async function fetchPosts() {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    Accept: 'application/json'
  };

  const attempts = [
    `${SUPABASE_URL}/rest/v1/posts?select=id,created_at&order=created_at.desc`,
    `${SUPABASE_URL}/rest/v1/posts?select=id`
  ];

  for (const url of attempts) {
    try {
      const result = await fetch(url, { headers });

      if (result.ok) {
        const posts = await result.json();
        return Array.isArray(posts) ? posts : [];
      }
    } catch (error) {
      // Keep the sitemap available even if the database is not ready yet.
    }
  }

  return [];
}

function renderUrl({ loc, lastmod, changefreq, priority }) {
  const tags = [
    `    <loc>${escapeXml(`${SITE_URL}${loc}`)}</loc>`,
    lastmod ? `    <lastmod>${escapeXml(lastmod)}</lastmod>` : '',
    changefreq ? `    <changefreq>${escapeXml(changefreq)}</changefreq>` : '',
    priority ? `    <priority>${escapeXml(priority)}</priority>` : ''
  ].filter(Boolean);

  return `  <url>\n${tags.join('\n')}\n  </url>`;
}

export default async function handler(request, response) {
  const today = new Date().toISOString().slice(0, 10);
  const posts = await fetchPosts();
  const postUrls = posts
    .filter((post) => post && post.id)
    .map((post) => {
      const lastmodDate = post.created_at ? new Date(post.created_at) : null;
      const validLastmod = lastmodDate && !Number.isNaN(lastmodDate.getTime())
        ? lastmodDate.toISOString().slice(0, 10)
        : today;

      return {
        loc: `/post/${encodeURIComponent(post.id)}`,
        lastmod: validLastmod,
        changefreq: 'weekly',
        priority: '0.7'
      };
    });

  const urls = [
    { loc: '/', lastmod: today, changefreq: 'daily', priority: '1.0' },
    { loc: '/executors', lastmod: today, changefreq: 'weekly', priority: '0.8' },
    { loc: '/privacy/', lastmod: today, changefreq: 'yearly', priority: '0.3' },
    { loc: '/cookies/', lastmod: today, changefreq: 'yearly', priority: '0.3' },
    ...postUrls
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls.map(renderUrl).join('\n'),
    '</urlset>'
  ].join('\n');

  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/xml; charset=utf-8');
  response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  response.end(xml);
}
