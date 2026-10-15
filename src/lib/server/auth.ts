import { betterAuth } from 'better-auth';
import { env } from '$env/dynamic/private';
import { pool } from './db';

const trustedOrigins = (env.BETTER_AUTH_TRUSTED_ORIGINS ?? '')
	.split(',')
	.map((s) => s.trim())
	.filter(Boolean);

export const auth = betterAuth({
	database: pool,
	trustedOrigins,
	emailAndPassword: { enabled: true },
	basePath: '/api/auth',
	baseURL: {
		url: env.BETTER_AUTH_URL || 'http://localhost:3000',
		// Tell better-auth the public-facing protocol is HTTPS
		protocol: 'https',
		allowedHosts: ['localhost:5173', 'localhost:5174', '192.168.1.75:3001', 'helli0s.ddns.net', 'symios.fr', 'localhost:3000', 'localhost:3001']
	},
	advanced: {
		// Internal access is HTTP — don't use __Secure- cookie prefix
		useSecureCookies: false
	},
	user: {
		additionalFields: {
			phone: { type: 'string', required: true },
			fname: { type: 'string', required: false },
			address: { type: 'string', required: false },
			city: { type: 'string', required: false },
			role: { type: 'number', required: false, input: false }
		},
		deleteUser: { enabled: true },
		changeEmail: { enabled: true }
	}
});

export type Auth = typeof auth;
export type SessionData = Awaited<ReturnType<typeof auth.api.getSession>>;
