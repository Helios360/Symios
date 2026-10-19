import { createAuthClient } from 'better-auth/svelte';

const origin = typeof window !== 'undefined'
	? window.location.origin
	: 'http://localhost:5173';

export const authClient = createAuthClient({
	baseURL: origin + '/api/auth'
});

export const { signIn, signUp, signOut, useSession } = authClient;