import { error, fail, redirect } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { pool } from '$lib/server/db';
import type { Actions, PageServerLoad } from './$types';

function requireAdmin(locals: App.Locals) {
	const user = locals.user;
	if (!user) throw redirect(303, '/account');
	if ((user as any).role !== 1) throw error(403, 'Accès réservé aux administrateurs');
	return user;
}

/* ───────────────────────────────────────────────
   LOAD — tout ce dont l'admin a besoin
   ─────────────────────────────────────────────── */

export const load: PageServerLoad = async ({ locals }) => {
	requireAdmin(locals);

	const [[users], [articles], [categories], [carts], [blogPosts]] = await Promise.all([
		pool.query(
			`SELECT id, name, email, phone, fname, address, city, role, createdAt
			 FROM user ORDER BY createdAt DESC`
		),
		pool.query(
			`SELECT a.id, a.slug, a.title, a.subtitle, a.price, a.category_id, a.cover_image_key,
			        a.details_html, c.name AS category_name
			 FROM articles a
			 LEFT JOIN categories c ON c.id = a.category_id
			 ORDER BY a.id ASC`
		),
		pool.query(`SELECT id, name FROM categories ORDER BY name ASC`),
		pool.query(
			`SELECT c.id, c.user_id, c.status, c.total_amount, c.created_at, c.delivery_date,
			        u.name AS user_name, u.email AS user_email
			 FROM carts c
			 LEFT JOIN user u ON u.id = c.user_id
			 ORDER BY c.created_at DESC`
		),
		pool.query(
			`SELECT bp.id, bp.slug, bp.title, bp.excerpt, bp.published, bp.published_at,
			        bp.created_at, u.name AS author_name
			 FROM blog_posts bp
			 LEFT JOIN user u ON u.id = bp.author_id
			 ORDER BY bp.created_at DESC`
		)
	]);

	return {
		users: users as any[],
		articles: articles as any[],
		categories: categories as any[],
		carts: carts as any[],
		blogPosts: blogPosts as any[]
	};
};

/* ───────────────────────────────────────────────
   ACTIONS
   ─────────────────────────────────────────────── */

export const actions: Actions = {
	/* ── USERS ────────────────────────────────── */

	setRole: async ({ locals, request }) => {
		requireAdmin(locals);
		const form = await request.formData();
		const userId = String(form.get('userId') ?? '');
		const role = Number(form.get('role'));
		if (!userId || !Number.isInteger(role)) return fail(400, { error: 'Paramètres invalides' });

		await pool.query(`UPDATE user SET role = ? WHERE id = ?`, [role, userId]);
		return { ok: true };
	},

	deleteUser: async ({ locals, request }) => {
		requireAdmin(locals);
		const form = await request.formData();
		const userId = String(form.get('userId') ?? '');
		if (!userId) return fail(400, { error: 'ID utilisateur manquant' });

		// Efface les cartes de l'utilisateur avant de supprimer son compte
		await pool.query(`DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = ?)`, [userId]);
		await pool.query(`DELETE FROM carts WHERE user_id = ?`, [userId]);
		await pool.query(`DELETE FROM account WHERE userId = ?`, [userId]);
		await pool.query(`DELETE FROM session WHERE userId = ?`, [userId]);
		await pool.query(`DELETE FROM user WHERE id = ?`, [userId]);
		return { ok: true };
	},

	/* ── ARTICLES ─────────────────────────────── */

	createArticle: async ({ locals, request }) => {
		requireAdmin(locals);
		const form = await request.formData();
		const title = String(form.get('title') ?? '').trim();
		const subtitle = String(form.get('subtitle') ?? '').trim();
		const slug = String(form.get('slug') ?? '').trim();
		const price = Number(form.get('price'));
		const categoryId = Number(form.get('categoryId'));
		const detailsHtml = String(form.get('detailsHtml') ?? '').trim();

		if (!title || !slug || isNaN(price) || !categoryId) {
			return fail(400, { error: 'Champs obligatoires manquants (titre, slug, prix, catégorie)' });
		}

		try {
			await pool.query(
				`INSERT INTO articles (slug, title, subtitle, price, category_id, details_html)
				 VALUES (?, ?, ?, ?, ?, ?)`,
				[slug, title, subtitle, price, categoryId, detailsHtml || null]
			);
		} catch (e: any) {
			if (e.code === 'ER_DUP_ENTRY') return fail(409, { error: 'Ce slug existe déjà' });
			return fail(500, { error: 'Erreur lors de la création' });
		}
		return { ok: true };
	},

	editArticle: async ({ locals, request }) => {
		requireAdmin(locals);
		const form = await request.formData();
		const id = Number(form.get('id'));
		const title = String(form.get('title') ?? '').trim();
		const subtitle = String(form.get('subtitle') ?? '').trim();
		const slug = String(form.get('slug') ?? '').trim();
		const price = Number(form.get('price'));
		const categoryId = Number(form.get('categoryId'));
		const detailsHtml = String(form.get('detailsHtml') ?? '').trim();

		if (!id || !title || !slug || isNaN(price) || !categoryId) {
			return fail(400, { error: 'Champs obligatoires manquants' });
		}

		try {
			await pool.query(
				`UPDATE articles
				 SET slug = ?, title = ?, subtitle = ?, price = ?, category_id = ?, details_html = ?
				 WHERE id = ?`,
				[slug, title, subtitle, price, categoryId, detailsHtml || null, id]
			);
		} catch (e: any) {
			if (e.code === 'ER_DUP_ENTRY') return fail(409, { error: 'Ce slug existe déjà' });
			return fail(500, { error: 'Erreur lors de la modification' });
		}
		return { ok: true };
	},

	deleteArticle: async ({ locals, request }) => {
		requireAdmin(locals);
		const form = await request.formData();
		const id = Number(form.get('id'));
		if (!id) return fail(400, { error: 'ID article manquant' });
		await pool.query(`DELETE FROM articles WHERE id = ?`, [id]);
		return { ok: true };
	},

	/* ── CATEGORIES ──────────────────────────── */

	createCategory: async ({ locals, request }) => {
		requireAdmin(locals);
		const form = await request.formData();
		const name = String(form.get('name') ?? '').trim();
		if (!name) return fail(400, { error: 'Nom de catégorie requis' });
		try {
			await pool.query(`INSERT INTO categories (name) VALUES (?)`, [name]);
		} catch (e: any) {
			if (e.code === 'ER_DUP_ENTRY') return fail(409, { error: 'Cette catégorie existe déjà' });
			return fail(500, { error: 'Erreur lors de la création' });
		}
		return { ok: true };
	},

	deleteCategory: async ({ locals, request }) => {
		requireAdmin(locals);
		const form = await request.formData();
		const id = Number(form.get('id'));
		if (!id) return fail(400, { error: 'ID catégorie manquant' });
		await pool.query(`DELETE FROM categories WHERE id = ?`, [id]);
		return { ok: true };
	},

	/* ── CARTS ────────────────────────────────── */

	cancelCart: async ({ locals, request }) => {
		requireAdmin(locals);
		const form = await request.formData();
		const cartId = String(form.get('cartId') ?? '');
		if (!cartId) return fail(400, { error: 'ID panier manquant' });
		await pool.query(`UPDATE carts SET status = 'cancelled' WHERE id = ?`, [cartId]);
		return { ok: true };
	},

	completeCart: async ({ locals, request }) => {
		requireAdmin(locals);
		const form = await request.formData();
		const cartId = String(form.get('cartId') ?? '');
		if (!cartId) return fail(400, { error: 'ID panier manquant' });
		await pool.query(`UPDATE carts SET status = 'completed' WHERE id = ?`, [cartId]);
		return { ok: true };
	},

	/* ── BLOG POSTS ───────────────────────────── */

	createBlogPost: async ({ locals, request }) => {
		requireAdmin(locals);
		const form = await request.formData();
		const title = String(form.get('title') ?? '').trim();
		const slug = String(form.get('slug') ?? '').trim();
		const excerpt = String(form.get('excerpt') ?? '').trim();
		const content = String(form.get('content') ?? '');
		const published = form.has('published');

		if (!title || !slug) return fail(400, { error: 'Titre et slug requis' });

		const id = randomUUID();
		try {
			await pool.query(
				`INSERT INTO blog_posts (id, slug, title, excerpt, content, author_id, published, published_at)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					id, slug, title, excerpt || null, content || null,
					locals.user!.id, published,
					published ? new Date() : null
				]
			);
		} catch (e: any) {
			if (e.code === 'ER_DUP_ENTRY') return fail(409, { error: 'Ce slug existe déjà' });
			return fail(500, { error: 'Erreur lors de la création' });
		}
		return { ok: true };
	},

	editBlogPost: async ({ locals, request }) => {
		requireAdmin(locals);
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		const title = String(form.get('title') ?? '').trim();
		const slug = String(form.get('slug') ?? '').trim();
		const excerpt = String(form.get('excerpt') ?? '').trim();
		const content = String(form.get('content') ?? '');
		const published = form.has('published');

		if (!id || !title || !slug) return fail(400, { error: 'ID, titre et slug requis' });

		try {
			await pool.query(
				`UPDATE blog_posts
				 SET slug = ?, title = ?, excerpt = ?, content = ?, published = ?,
				     published_at = CASE WHEN ? = 1 AND published_at IS NULL THEN NOW() ELSE published_at END
				 WHERE id = ?`,
				[slug, title, excerpt || null, content || null, published, published, id]
			);
		} catch (e: any) {
			if (e.code === 'ER_DUP_ENTRY') return fail(409, { error: 'Ce slug existe déjà' });
			return fail(500, { error: 'Erreur lors de la modification' });
		}
		return { ok: true };
	},

	deleteBlogPost: async ({ locals, request }) => {
		requireAdmin(locals);
		const form = await request.formData();
		const id = String(form.get('id') ?? '');
		if (!id) return fail(400, { error: 'ID article manquant' });
		await pool.query(`DELETE FROM blog_posts WHERE id = ?`, [id]);
		return { ok: true };
	}
};