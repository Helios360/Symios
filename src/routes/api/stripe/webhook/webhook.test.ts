import { describe, it, expect } from 'vitest';
import { stripe } from '$lib/server/stripe';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { POST } from './+server';

/**
 * Tests de sécurité du webhook Stripe — vérifient la signature HMAC
 * réelle via stripe.webhooks.constructEvent (aucun appel réseau).
 */

function signedPayload(overrides: Record<string, unknown> = {}) {
	const payload = JSON.stringify({
		id: 'evt_1',
		type: 'checkout.session.completed',
		data: { object: { id: 'cs_test_1', metadata: { cart_id: 'cart-1' }, ...overrides } }
	});
	const header = stripe!.webhooks.generateTestHeaderString({
		payload,
		secret: STRIPE_WEBHOOK_SECRET
	});
	return { payload, header };
}

describe('webhook Stripe (signature HMAC)', () => {
	it('accepte une signature valide', () => {
		const { payload, header } = signedPayload();
		const event = stripe!.webhooks.constructEvent(payload, header, STRIPE_WEBHOOK_SECRET);
		expect(event.type).toBe('checkout.session.completed');
	});

	it('rejette une signature falsifiée', () => {
		const { payload } = signedPayload();
		const tampered = 't=1,v1=deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
		expect(() =>
			stripe!.webhooks.constructEvent(payload, tampered, STRIPE_WEBHOOK_SECRET)
		).toThrow();
	});

	it('rejette un payload altéré (anti-replay)', () => {
		const { payload, header } = signedPayload();
		const altered = payload.replace('cart-1', 'cart-2');
		expect(() =>
			stripe!.webhooks.constructEvent(altered, header, STRIPE_WEBHOOK_SECRET)
		).toThrow();
	});

	it('le handler rejette une requête sans en-tête stripe-signature', async () => {
		await expect(
			POST({
				request: new Request('http://localhost/api/stripe/webhook', {
					method: 'POST',
					body: '{}'
				})
			} as any)
		).rejects.toMatchObject({ status: 400 });
	});
});