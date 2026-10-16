<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | null } = $props();

	let email = $state('');
	let type = $state('acces');
	let message = $state('');

	// Initialize from server data
	$effect(() => {
		email = data.email;
	});

	// Affiche le message de succès après envoi du formulaire (avec enhance).
	let sent = $state(false);

	const handleEnhance = () => async ({ result }: { result: { type: string } }) => {
		if (result.type === 'success') sent = true;
	};
</script>

<svelte:head>
	<title>Mes données (RGPD) | Symios</title>
	<meta name="description" content="Demandez l'accès, la portabilité ou la suppression de vos données personnelles — Symios, conformément au RGPD." />
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="legal-page">
	<a href={resolve('/account')} class="back mono-alt">← Retour à mon compte</a>

	<article class="legal-article">
		<header class="legal-header">
			<p class="section-index">// DONNÉES PERSONNELLES</p>
			<h1>Mes données (RGPD)</h1>
			<p class="legal-meta mono-alt">
				Conformément au Règlement (UE) 2016/679, vous pouvez demander l'accès, la portabilité ou
				l'effacement de vos données personnelles.
			</p>
		</header>

		<div class="legal-content">
			<p>
				Votre demande sera traitée sous <strong>un mois maximum</strong> (article 12 du RGPD). Un email
				de confirmation vous sera adressé à l'adresse indiquée ci-dessous.
			</p>

			{#if sent || form?.success}
				<div class="alert alert-success" role="status">
					Demande envoyée ! Vous recevrez une réponse à l'adresse indiquée sous 30 jours.
				</div>
			{/if}

			{#if form?.error}
				<div class="alert alert-error" role="alert">{form.error}</div>
			{/if}

			<form method="POST" use:enhance={handleEnhance} class="gdpr-form">
				<div class="form-grid">
					<div class="full">
						<label class="label" for="gdpr-email">Email de contact *</label>
						<input
							id="gdpr-email"
							class="input"
							type="email"
							name="email"
							required
							bind:value={email}
							placeholder="vous@exemple.fr"
						/>
					</div>

					<div class="full">
						<label class="label" for="gdpr-type">Type de demande *</label>
						<select id="gdpr-type" class="input" name="type" bind:value={type} required>
							<option value="acces">Accès à mes données</option>
							<option value="suppression">Suppression de mes données</option>
							<option value="autre">Autre</option>
						</select>
					</div>

					<div class="full">
						<label class="label" for="gdpr-message">Message</label>
						<textarea
							id="gdpr-message"
							class="input"
							name="message"
							rows="5"
							bind:value={message}
							placeholder="Précisez votre demande (données concernées, contexte…)."
						></textarea>
					</div>
				</div>

				<div class="gdpr-actions">
					<button type="submit" class="cta">Envoyer ma demande</button>
					<p class="mono-alt note">* champ obligatoire</p>
				</div>
			</form>
		</div>
	</article>

	<footer class="legal-footer">
		<a href={resolve('/account')} class="mono-alt">← Retour à mon compte</a>
	</footer>
</section>

<style>
	.legal-page {
		max-width: 800px;
		margin-inline: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		position: relative;
		z-index: 10;
	}

	.back {
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		text-decoration: none;
	}
	.back:hover { color: var(--accent); }

	.legal-article {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.legal-header h1 {
		margin-top: 0.3rem;
		line-height: 1.05;
	}

	.legal-meta {
		font-size: 13px;
		line-height: 1.6;
		color: var(--text-muted);
		text-transform: none;
	}

	.legal-content {
		font-size: 15.5px;
		line-height: 1.75;
		color: var(--text-color);
	}

	.legal-footer {
		border-top: 1px dashed #c9b894;
		padding-top: 1.5rem;
	}
	.legal-footer a {
		font-size: 13px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}

	.gdpr-form {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		margin-top: 1.2rem;
		padding: 1.5rem;
		background: var(--surface);
		border: var(--line) solid var(--primary);
		box-shadow: var(--shadow-hard-sm);
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	.form-grid .full {
		grid-column: 1 / -1;
	}

	.gdpr-form select {
		appearance: auto;
		font-family: "visibility", sans-serif;
	}

	.gdpr-form textarea {
		resize: vertical;
		min-height: 110px;
		font-family: "visibility", sans-serif;
	}

	.gdpr-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.gdpr-actions .cta {
		cursor: pointer;
	}
	.note {
		font-size: 11px;
		letter-spacing: 0.08em;
		color: var(--text-muted);
		text-transform: uppercase;
	}

	@media (max-width: 640px) {
		.legal-page { padding: 1.2rem; }
		.legal-header h1 { font-size: 28px; }
		.legal-content { font-size: 14.5px; }
		.form-grid { grid-template-columns: 1fr; }
	}
</style>