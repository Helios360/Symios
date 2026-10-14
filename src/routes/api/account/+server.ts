import { json, error } from '@sveltejs/kit';
import { pool } from '$lib/server/db';
import {
	validateName,
	validatePhone,
	validateAddress,
	validateCity,
	hasErrors,
	type FieldError
} from '$lib/validation';
import type { RequestHandler } from './$types';

const EDITABLE = ['name', 'fname', 'phone', 'address', 'city'] as const;
type Editable = (typeof EDITABLE)[number];

function requireUser(locals: App.Locals) {
	if (!locals.user) throw error(401, 'Authentification requise');
	return locals.user;
}

async function readProfile(id: string) {
	const [rows] = await pool.query(
		`SELECT id, name, email, fname, phone, address, city, role, createdAt
		 FROM user WHERE id = ? LIMIT 1`,
		[id]
	);
	return (rows as any[])[0] ?? null;
}

export const GET: RequestHandler = async ({ locals }) => {
	const user = requireUser(locals);
	const profile = await readProfile(user.id);
	if (!profile) throw error(404, 'Profil introuvable');
	return json(profile);
};

export const PATCH: RequestHandler = async ({ locals, request }) => {
	const user = requireUser(locals);

	let body: Record<string, unknown>;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Corps de requête invalide');
	}

	// On ne retient que les champs éditables réellement fournis.
	const patch: Partial<Record<Editable, string>> = {};
	for (const key of EDITABLE) {
		if (key in body) patch[key] = String(body[key] ?? '').trim();
	}
	if (Object.keys(patch).length === 0) {
		throw error(400, 'Aucun champ à mettre à jour');
	}

	const errors: Record<string, FieldError> = {};
	if ('name' in patch) errors.name = validateName(patch.name!, { required: true });
	if ('fname' in patch) errors.fname = validateName(patch.fname!, { required: false });
	if ('phone' in patch) errors.phone = validatePhone(patch.phone!, { required: true });
	if ('address' in patch) errors.address = validateAddress(patch.address!, { required: false });
	if ('city' in patch) errors.city = validateCity(patch.city!, { required: false });

	if (hasErrors(errors)) {
		return json({ errors }, { status: 422 });
	}

	const fields = Object.keys(patch) as Editable[];
	const assignments = fields.map((f) => `${f} = ?`).join(', ');
	const values = fields.map((f) => patch[f]);
	await pool.query(`UPDATE user SET ${assignments}, updatedAt = ? WHERE id = ?`, [
		...values,
		new Date(),
		user.id
	]);

	return json(await readProfile(user.id));
};

export const DELETE: RequestHandler = async ({ locals, request }) => {
	requireUser(locals);

	let password = '';
	try {
		const body = await request.json();
		password = String(body?.password ?? '');
	} catch {
		// corps optionnel
	}
	if (!password) throw error(400, 'Mot de passe requis pour supprimer le compte');

	// Lazy-import auth to avoid BetterAuthError during SSR build
	const { APIError } = await import('better-auth/api');
	const { auth } = await import('$lib/server/auth');

	try {
		await auth.api.deleteUser({ headers: request.headers, body: { password } });
	} catch (e) {
		if (e instanceof APIError) {
			throw error(e.statusCode ?? 400, e.message);
		}
		throw e;
	}

	return json({ deleted: true });
};
