import { cartItemCount } from '$lib/server/cart';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;
	const isAdmin = user && (user as any).role === 1;

	// Only query cart count if user is authenticated
	const cartCount = user ? await cartItemCount(user.id) : 0;

	return {
		authenticated: !!user,
		isAdmin,
		cartCount
	};
};