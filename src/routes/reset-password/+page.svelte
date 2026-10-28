<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import PasswordInput from '$lib/components/password-input.svelte';
	import { validatePassword, validatePasswordConfirm } from '$lib/validation';
	import type { FieldError } from '$lib/validation';

	const token = $derived(page.url.searchParams.get('token') ?? '');

	let password = $state('');
	let confirm = $state('');
	let error = $state<string | null>(null);
	let done = $state(false);
	let busy = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = null;

		if (!token) { error = 'Lien invalide ou expiré. Faites une nouvelle demande.'; return; }
		const pwErr: FieldError = validatePassword(password, { isNew: true });
		const cfErr: FieldError = validatePasswordConfirm(password, confirm);
		if (pwErr) { error = pwErr; return; }
		if (cfErr) { error = cfErr; return; }

		busy = true;
		const res = await authClient.resetPassword({ newPassword: password, token });
		busy = false;

		if (res.error) {
			error = res.error.message ?? 'Le lien est invalide ou a expiré.';
			return;
		}
		done = true;
	}
</script>

<svelte:head>
	<title>Nouveau mot de passe | Symios</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="rp-page">
	{#if done}
		<article class="panel card">
			<p class="section-index">// MOT DE PASSE MODIFIÉ</p>
			<h1>✅ C'est fait !</h1>
			<p class="mono-alt sub">Votre mot de passe a été réinitialisé. Vous pouvez vous connecter.</p>
			<a href="/account" class="cta">Se connecter</a>
		</article>
	{:else}
		<article class="panel card">
			<header>
				<p class="section-index">// NOUVEAU MOT DE PASSE</p>
				<h1>Choisissez un mot de passe</h1>
			</header>

			{#if error}<div class="alert alert-error" role="alert">{error}</div>{/if}

			<form class="form-grid" onsubmit={handleSubmit}>
				<div class="full">
					<label class="label" for="rp-pass">Nouveau mot de passe</label>
					<PasswordInput id="rp-pass" class="input" bind:value={password} aria-invalid={!!error} required minlength={8} />
				</div>
				<div class="full">
					<label class="label" for="rp-confirm">Confirmation</label>
					<PasswordInput id="rp-confirm" class="input" bind:value={confirm} aria-invalid={!!error} required minlength={8} />
				</div>
				<button type="submit" class="cta" disabled={busy}>
					{busy ? 'Mise à jour…' : 'Réinitialiser'}
				</button>
			</form>
		</article>
	{/if}
</section>

<style>
	.rp-page {
		max-width: 520px;
		margin-inline: auto;
		padding: 2rem;
	}
	.card {
		padding: 1.6rem;
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}
	.card header h1 {
		margin-top: 0.3rem;
		font-size: 28px;
	}
	.sub {
		font-size: 13px;
		color: var(--text-muted);
		line-height: 1.6;
	}
	.form-grid {
		display: grid;
		gap: 1rem;
	}
	.form-grid .full { grid-column: 1 / -1; }
	.form-grid .cta {
		cursor: pointer;
		justify-self: start;
	}
	.alert-error {
		padding: 0.8rem 1rem;
		border-radius: var(--smaller-radius);
		font-size: 13px;
		background: #fee2e2;
		border: 2px solid #dc2626;
		color: #7f1d1d;
	}
</style>