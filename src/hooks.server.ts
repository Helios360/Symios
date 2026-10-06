import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { auth } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	// Expose the current session/user to `event.locals` for load functions
	// and endpoints.
	const session = await auth.api.getSession({ headers: event.request.headers });
	event.locals.session = session?.session ?? null;
	event.locals.user = session?.user ?? null;

	// Let Better Auth handle its own routes (/api/auth/*), otherwise continue.
	return svelteKitHandler({ event, resolve, auth, building });
};