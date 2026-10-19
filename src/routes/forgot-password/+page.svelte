<script lang="ts">
	import { resolve } from '$app/paths';
	import { authClient } from '$lib/auth-client';
	import { validateEmail } from '$lib/validation';

	let email = $state('');
	let error = $state<string | null>(null);
	let sent = $state(false);
	let busy = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = null;
		const err = validateEmail(email);
		if (err) { error = err; return; }

		busy = true;
		const res = await authClient.requestPasswordReset({ email: email.trim() });
		busy = false;

		if (res.error) {
			error = res.error.message ?? 'Erreur lors de la demande.';
			return;
		}
		sent = true;
	}
</script>

<svelte:head>
	<title>Mot de passe oublié | Symios</title>
	<meta name="description" content="Réinitialisez votre mot de passe Symios." />
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="auth-page">
	<a href={resolve('/account')} class="back mono-alt">← Retour à la connexion</a>

	<article class="panel card">
		<header>
			<p class="section-index">// MOT DE PASSE OUBLIÉ</p>
			<h1>Réinitialisation</h1>
		</header>

		{#if sent}
			<div class="alert alert-success" role="status">
				Email envoyé ! Vérifiez votre boîte de réception (et vos spams).<br>
				Le lien expire dans 1 heure.
			</div>
			<a href={resolve('/account')} class="cta">Retour à la connexion</a>
		{:else}
			<p class="mono-alt sub">
				Saisissez l'email associé à votre compte. Vous recevrez un lien
				permettant de choisir un nouveau mot de passe.
			</p>

			{#if error}<div class="alert alert-error" role="alert">{error}</div>{/if}

			<form class="form-grid" onsubmit={handleSubmit}>
				<div class="full">
					<label class="label" for="fp-email">Email</label>
					<input
						id="fp-email"
						class="input"
						type="email"
						bind:value={email}
						aria-invalid={!!error}
						placeholder="vous@exemple.fr"
						required
					/>
				</div>
				<button type="submit" class="cta" disabled={busy}>
					{busy ? 'Envoi…' : 'Envoyer le lien'}
				</button>
			</form>
		{/if}
	</article>
</section>

<style>
	.auth-page {
		max-width: 520px;
		margin-inline: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.back {
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		text-decoration: none;
	}
	.back:hover { color: var(--accent); }
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
	.alert {
		padding: 0.8rem 1rem;
		border-radius: var(--smaller-radius);
		font-size: 13px;
		line-height: 1.5;
	}
	.alert-success {
		background: #d1fae5;
		border: 2px solid #059669;
		color: #064e3b;
	}
	.alert-error {
		background: #fee2e2;
		border: 2px solid #dc2626;
		color: #7f1d1d;
	}
</style>