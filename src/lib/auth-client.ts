import { createAuthClient } from 'better-auth/svelte';

export const authClient = createAuthClient({
	baseURL: 'https://helli0s.ddns.net',
	basePath: '/symios/api/auth'
});

export const { signIn, signUp, signOut, useSession } = authClient;