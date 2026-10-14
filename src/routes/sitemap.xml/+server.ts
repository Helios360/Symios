import { pool } from '$lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const SITE_URL = 'https://www.symios.com';

	const [articleRows] = await pool.query(
		`SELECT slug FROM articles ORDER BY id ASC`
	);
	const articles = (articleRows as any[]).map((r: any) => r.slug);

	const [blogRows] = await pool.query(
		`SELECT slug FROM blog_posts WHERE published = true ORDER BY published_at DESC`
	);
	const posts = (blogRows as any[]).map((r: any) => r.slug);

	const staticPages = [
		{ loc: '', priority: '1.0', changefreq: 'weekly' },
		{ loc: '/shop', priority: '0.9', changefreq: 'weekly' },
		{ loc: '/blog', priority: '0.8', changefreq: 'weekly' },
		{ loc: '/contact', priority: '0.7', changefreq: 'monthly' },
		{ loc: '/services', priority: '0.7', changefreq: 'monthly' },
		{ loc: '/project', priority: '0.8', changefreq: 'monthly' },
		{ loc: '/ressources', priority: '0.6', changefreq: 'monthly' },
	];

	const urlset = staticPages
		.map(
			(p) => `<url>
		<loc>${SITE_URL}${p.loc}</loc>
		<priority>${p.priority}</priority>
		<changefreq>${p.changefreq}</changefreq>
	</url>`
		)
		.join('\n');

	const articleUrls = articles
		.map(
			(slug) => `<url>
		<loc>${SITE_URL}/shop/${slug}</loc>
		<priority>0.8</priority>
		<changefreq>monthly</changefreq>
	</url>`
		)
		.join('\n');

	const blogUrls = posts
		.map(
			(slug) => `<url>
		<loc>${SITE_URL}/blog/${slug}</loc>
		<priority>0.7</priority>
		<changefreq>monthly</changefreq>
	</url>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
${articleUrls}
${blogUrls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=3600'
		}
	});
};