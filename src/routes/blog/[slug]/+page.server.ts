import { error } from '@sveltejs/kit';
import { pool } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [rows] = await pool.query(
		`SELECT bp.id, bp.slug, bp.title, bp.excerpt, bp.content, bp.published, bp.published_at,
		        bp.created_at, u.name AS author_name
		 FROM blog_posts bp
		 LEFT JOIN user u ON u.id = bp.author_id
		 WHERE bp.slug = ? AND bp.published = true
		 LIMIT 1`,
		[params.slug]
	);

	const post = (rows as any[])[0];
	if (!post) throw error(404, 'Article introuvable');

	return { post };
};