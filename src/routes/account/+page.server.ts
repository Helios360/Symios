import { fail } from '@sveltejs/kit';
import { pool } from '$lib/server/db';
import {
	getActiveCart,
	getCartHistory,
	removeItem,
	clearActiveCart,
	checkout
} from '$lib/server/cart';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return { profile: null, cart: null, history: [] };

	const [profileRows, cart, history] = await Promise.all([
		pool.query(
			`SELECT id, name, email, fname, phone, address, city, createdAt
			 FROM user WHERE id = ? LIMIT 1`,
			[locals.user.id]
		),
		getActiveCart(locals.user.id),
		getCartHistory(locals.user.id)
	]);

	return {
		profile: (profileRows[0] as any[])[0] ?? null,
		cart,
		history
	};
};

export const actions: Actions = {
	removeItem: async ({ locals, request }) => {
		if (!locals.user) return fail(401, { error: 'Authentification requise' });
		const form = await request.formData();
		const itemId = Number(form.get('itemId'));
		if (!Number.isInteger(itemId) || itemId <= 0) return fail(400, { error: 'Ligne invalide' });
		await removeItem(locals.user.id, itemId);
		return { ok: true };
	},

	clearCart: async ({ locals }) => {
		if (!locals.user) return fail(401, { error: 'Authentification requise' });
		await clearActiveCart(locals.user.id);
		return { ok: true };
	},

	checkout: async ({ locals }) => {
		if (!locals.user) return fail(401, { error: 'Authentification requise' });
		const cartId = await checkout(locals.user.id);
		if (!cartId) return fail(400, { error: 'Votre panier est vide' });
		return { checkedOut: true };
	}
};
