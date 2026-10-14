import { createAuthClient } from 'better-auth/svelte';

export const authClient = createAuthClient({
	baseURL: 'https://symios.fr',
	basePath: '/api/auth'
});

export const { signIn, signUp, signOut, useSession } = authClient;