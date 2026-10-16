<script lang="ts">
	import { page } from "$app/state";
	import { resolve } from "$app/paths";
</script>

<svelte:head>
	<title>{page.status} — Symios</title>
	<meta name="description" content="Page non trouvée — Symios" />
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="error-page">
	<h1 class="error-code">{page.status}</h1>
	<hr />
	<h2 class="error-msg">{page.error?.message || 'Une erreur est survenue.'}</h2>
	<a href={resolve('/')} class="cta">Retour à l'accueil →</a>
</section>

<style>
	.error-page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1.2rem;
		padding: 4rem 2rem;
		text-align: center;
		min-height: 40vh;
	}
	.error-code {
		font-family: 'Monoton', sans-serif;
		font-size: 80px;
		font-weight: 800;
		color: var(--accent);
		line-height: 1;
	}
	.error-msg {
		font-size: 18px;
		color: var(--text-color);
		font-weight: 400;
	}
	hr {
		width: 50%;
		border: none;
		border-top: 2px solid var(--primary);
		opacity: 0.3;
	}
</style>