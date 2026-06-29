import { cartItemCount } from '$lib/server/cart';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		authenticated: !!locals.user,
		cartCount: locals.user ? await cartItemCount(locals.user.id) : 0
	};
};
