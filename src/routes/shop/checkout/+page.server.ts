import { fail, redirect } from '@sveltejs/kit';
import { getActiveCart, attachStripeSession, setDeliveryInfo } from '$lib/server/cart';
import { createCheckoutSession } from '$lib/server/stripe';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/account');

	const cart = await getActiveCart(locals.user.id);
	if (!cart || cart.items.length === 0) throw redirect(303, '/shop');

	// Convert prices to cents for Stripe
	const lineItems = cart.items.map((item) => ({
		title: item.title ?? 'Article',
		quantity: item.quantity,
		unitPrice: Math.round(item.price! * 100) // Stripe uses cents
	}));

	return { cart, lineItems };
};

export const actions: Actions = {
	setDelivery: async ({ locals, request }) => {
		if (!locals.user) return fail(401, { error: 'Authentification requise' });

		const form = await request.formData();
		const deliveryDate = (form.get('deliveryDate') as string) || null;
		const customerMessage = (form.get('customerMessage') as string) || null;

		await setDeliveryInfo(locals.user.id, deliveryDate, customerMessage);
		return { ok: true };
	},

	checkout: async ({ locals, request, url }) => {
		if (!locals.user) return fail(401, { error: 'Authentification requise' });

		const cart = await getActiveCart(locals.user.id);
		if (!cart || cart.items.length === 0) return fail(400, { error: 'Votre panier est vide' });

		// Save delivery info from the form if provided
		const form = await request.formData();
		const deliveryDate = (form.get('deliveryDate') as string) || cart.delivery_date;
		const customerMessage = (form.get('customerMessage') as string) || cart.customer_message;
		await setDeliveryInfo(locals.user.id, deliveryDate, customerMessage);

		// Build Stripe Checkout Session
		const origin = request.headers.get('origin') || `${url.protocol}//${url.host}`;

		const result = await createCheckoutSession({
			cartId: cart.id,
			lineItems: cart.items.map((item) => ({
				title: item.title ?? 'Article',
				quantity: item.quantity,
				unitPrice: Math.round(item.price! * 100)
			})),
			successUrl: `${origin}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
			cancelUrl: `${origin}/shop/checkout`
		});

		// Link the Stripe session to the cart
		await attachStripeSession(locals.user.id, result.sessionId);

		// Redirect to Stripe hosted checkout
		throw redirect(303, result.url);
	}
};