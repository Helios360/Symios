import { json, error } from '@sveltejs/kit';
import { building } from '$app/environment';
import { stripe } from '$lib/server/stripe';

let _confirmStripePayment: ((sessionId: string) => Promise<string | null>) | null = null;
async function confirmStripePayment(sessionId: string) {
	if (!_confirmStripePayment) {
		_confirmStripePayment = (await import('$lib/server/cart')).confirmStripePayment;
	}
	return _confirmStripePayment(sessionId);
}

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	if (building) return json({ received: true });

	const { STRIPE_WEBHOOK_SECRET } = await import('$env/static/private');

	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	if (!signature) throw error(400, 'Missing stripe-signature header');

	let event;
	try {
		event = stripe!.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.error('Stripe webhook signature verification failed:', err);
		throw error(401, 'Webhook signature verification failed');
	}

	// Handle the checkout.session.completed event
	if (event.type === 'checkout.session.completed') {
		const session = event.data.object as any;
		const cartId = session.metadata?.cart_id;

		if (!cartId) {
			console.warn('Stripe webhook: no cart_id in session metadata', session.id);
			return json({ received: true });
		}

		const confirmed = await confirmStripePayment(session.id);
		if (confirmed) {
			console.log(`Stripe webhook: cart ${confirmed} confirmed (session ${session.id})`);
		} else {
			console.warn(`Stripe webhook: cart not found or already processed for session ${session.id}`);
		}
	}

	return json({ received: true });
};