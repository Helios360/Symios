import { fail, redirect } from '@sveltejs/kit';
import { validateEmail } from '$lib/validation';
import { notifyRgpdRequest, confirmRgpdRequest } from '$lib/server/email';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Accès réservé aux utilisateurs connectés (connexion sur /account).
	if (!locals.user) throw redirect(302, '/account');
	return { email: locals.user.email ?? '' };
};

const DEMANDE_TYPES = ['acces', 'suppression', 'autre'] as const;

export const actions: Actions = {
	default: async ({ locals, request }) => {
		if (!locals.user) throw redirect(302, '/account');

		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim();
		const type = String(form.get('type') ?? '');
		const message = String(form.get('message') ?? '').trim();

		const emailErr = validateEmail(email);
		if (emailErr) {
			return fail(400, { error: emailErr, email, type, message });
		}
		if (!(DEMANDE_TYPES as readonly string[]).includes(type)) {
			return fail(400, { error: 'Type de demande invalide.', email, type, message });
		}

		const details = {
			userId: locals.user.id,
			email,
			type,
			message
		};

		// Notifier l'administrateur (Elias)
		await notifyRgpdRequest(details);

		// Envoyer un accusé de réception à l'utilisateur
		await confirmRgpdRequest(email);

		// Toujours journaliser en base / logs pour backup
		console.log('[RGPD] Demande traitee', details);

		return { success: true };
	}
};