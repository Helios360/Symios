import { APIError } from 'better-auth';
import type { BetterAuthPlugin } from 'better-auth';

export const PASSWORD_RULES = {
	minLength: 8,
	requireUppercase: true,
	requireSpecialChar: true
} as const;

export function validatePassword(password: string): string | null {
	if (password.length < PASSWORD_RULES.minLength) {
		return `Le mot de passe doit contenir au moins ${PASSWORD_RULES.minLength} caractères`;
	}
	if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
		return 'Le mot de passe doit contenir au moins une majuscule';
	}
	if (PASSWORD_RULES.requireSpecialChar && !/[^a-zA-Z0-9]/.test(password)) {
		return 'Le mot de passe doit contenir au moins un symbole (ex: @, #, $, !, etc.)';
	}
	return null;
}

export function passwordPolicyPlugin(): BetterAuthPlugin {
	return {
		id: 'password-policy',
		hooks: {
			before: [
				{
					matcher(context) {
						return (
							context.path === '/sign-up/email' ||
							context.path === '/reset-password'
						);
					},
					handler: async (ctx) => {
						const body = ctx.body as Record<string, unknown> | undefined;
						const password = body?.password as string | undefined;

						if (!password) {
							throw new APIError('BAD_REQUEST', {
								message: 'Le mot de passe est requis'
							});
						}

						const error = validatePassword(password);
						if (error) {
							throw new APIError('BAD_REQUEST', {
								message: error
							});
						}
					}
				} as const
			] as const
		}
	};
}