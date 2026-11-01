import type { PageServerLoad } from './$types';
import type { Cart } from '$lib/server/cart';

let _confirmStripePayment: ((sessionId: string) => Promise<Cart | null>) | null = null;
async function confirmStripePayment(sessionId: string) {
	if (!_confirmStripePayment) {
		_confirmStripePayment = (await import('$lib/server/cart')).confirmStripePayment;
	}
	return _confirmStripePayment(sessionId);
}

let _sendOrderConfirmationEmail: ((cart: Cart) => Promise<void>) | null = null;
async function sendOrderConfirmationEmail(cart: Cart) {
	if (!_sendOrderConfirmationEmail) {
		_sendOrderConfirmationEmail = (await import('$lib/server/email')).sendOrderConfirmationEmail;
	}
	return _sendOrderConfirmationEmail(cart);
}

/**
 * Secours au webhook Stripe : à l'arrivée sur la page de succès, on vérifie
 * auprès de Stripe que la session est bien payée et on valide le panier.
 * Idempotent (confirmStripePayment ne passe pending → completed qu'une fois),
 * donc sans effet si le webhook a déjà traité le paiement — et ça couvre le
 * cas où le webhook n'est pas configuré ou a échoué.
 */
export const load: PageServerLoad = async ({ url }) => {
	const sessionId = url.searchParams.get('session_id');
	if (!sessionId) return { order: null };

	try {
		const { stripe } = await import('$lib/server/stripe');
		if (!stripe) return { order: null };

		const session = await stripe.checkout.sessions.retrieve(sessionId);
		if (session.status !== 'complete' || session.payment_status !== 'paid') {
			return { order: null };
		}

		const cart = await confirmStripePayment(sessionId);
		if (cart) await sendOrderConfirmationEmail(cart);

		return { order: cart ? { id: cart.id } : null };
	} catch (err) {
		console.error('[checkout success] Confirmation de secours échouée:', err);
		return { order: null };
	}
};