import { pool } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [rows] = await pool.query(
		`SELECT bp.id, bp.slug, bp.title, bp.excerpt, bp.published_at, bp.created_at,
		        u.name AS author_name
		 FROM blog_posts bp
		 LEFT JOIN user u ON u.id = bp.author_id
		 WHERE bp.published = true
		 ORDER BY bp.published_at DESC`
	);

	return {
		posts: rows as any[]
	};
};