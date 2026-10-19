import { betterAuth } from 'better-auth';
import { env } from '$env/dynamic/private';
import { pool } from './db';
import { sendEmail } from './email';
import { passwordPolicyPlugin } from './password-policy';

const trustedOrigins = (env.BETTER_AUTH_TRUSTED_ORIGINS ?? '')
	.split(',')
	.map((s) => s.trim())
	.filter(Boolean);

export const auth = betterAuth({
	database: pool,
	trustedOrigins,
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 8,
		async sendResetPassword({ user, url }) {
			await sendEmail({
				to: user.email,
				subject: 'Réinitialisation de votre mot de passe — Symios',
				text: [
					`Bonjour,`,
					``,
					`Vous avez demandé la réinitialisation de votre mot de passe Symios.`,
					`Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe :`,
					``,
					url,
					``,
					`Ce lien expire dans 1 heure.`,
					`Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.`,
					``,
					`Cordialement,`,
					`Symios`
				].join('\n')
			});
		}
	},
	basePath: '/api/auth',
	baseURL: {
		url: env.BETTER_AUTH_URL || 'http://localhost:3000',
		// Tell better-auth the public-facing protocol is HTTPS
		protocol: 'https',
		allowedHosts: ['localhost:5173', 'localhost:5174', '192.168.1.75:3001', 'helli0s.ddns.net', 'symios.fr', 'www.symios.fr', 'localhost:3000', 'localhost:3001']
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
	},
	plugins: [
		passwordPolicyPlugin()
	]
});

export type Auth = typeof auth;
export type SessionData = Awaited<ReturnType<typeof auth.api.getSession>>;
