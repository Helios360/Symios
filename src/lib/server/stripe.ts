import Stripe from 'stripe';
import { STRIPE_PRIVATE_KEY } from '$env/static/private';
import { building } from '$app/environment';

// Don't initialize Stripe during the build step (no env vars available).
export const stripe = building
	? (null as unknown as Stripe)
	: new Stripe(STRIPE_PRIVATE_KEY, { apiVersion: '2026-08-26.dahlia' });

export interface CreateCheckoutParams {
	cartId: string;
	lineItems: Array<{
		title: string;
		quantity: number;
		unitPrice: number; // cents
	}>;
	successUrl: string;
	cancelUrl: string;
}

/**
 * Crée une Stripe Checkout Session à partir des lignes du panier.
 * Renvoie l'URL de redirection vers Stripe ainsi que le session_id.
 */
export async function createCheckoutSession(params: CreateCheckoutParams) {
	const session = await stripe!.checkout.sessions.create({
		mode: 'payment',
		line_items: params.lineItems.map((item) => ({
			price_data: {
				currency: 'eur',
				product_data: { name: item.title },
				unit_amount: item.unitPrice // en centimes
			},
			quantity: item.quantity
		})),
		metadata: {
			cart_id: params.cartId
		},
		success_url: params.successUrl,
		cancel_url: params.cancelUrl
	});

	return {
		sessionId: session.id,
		url: session.url!
	};
}