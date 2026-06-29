import { fail, redirect } from '@sveltejs/kit';
import { getArticles } from '$lib/server/articles';
import { addItem } from '$lib/server/cart';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const articles = await getArticles();

	const categories = [...new Map(articles.map((a) => [a.category, a.categoryKey])).entries()].map(
		([name, key]) => ({ name, key, count: articles.filter((a) => a.category === name).length })
	);

	return { articles, categories, authenticated: !!locals.user };
};

export const actions: Actions = {
	addToCart: async ({ request, locals }) => {
		// Seuls les utilisateurs authentifiés peuvent remplir un panier.
		if (!locals.user) throw redirect(303, '/account');

		const form = await request.formData();
		const articleId = Number(form.get('articleId'));
		if (!Number.isInteger(articleId) || articleId <= 0) {
			return fail(400, { error: 'Article invalide' });
		}
		await addItem(locals.user.id, articleId, 1);
		return { added: true };
	}
};
