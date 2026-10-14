<script lang="ts">
	import { base } from '$app/paths';
	import { reveal } from '$lib/motion/reveal';
	import { tilt } from '$lib/motion/tilt';
</script>

<svelte:head>
	<title>Démarrer un projet | Symios</title>
	<meta name="description" content="Vous avez un projet IA, automatisation ou infrastructure ? Racontez-le moi — audit gratuit." />
</svelte:head>

<section class="project-page" use:reveal>
	<header class="project-head">
		<p class="section-index">// PROJET</p>
		<h1>Démarrer un projet</h1>
		<p class="project-desc">
			Vous avez une idée, un besoin, un problème à résoudre&nbsp;? <br />
			Racontez-moi tout — je vous offre un audit gratuit pour faire le point.
		</p>
	</header>

	<div class="contact-cta">
		<div class="cta-card panel" use:tilt={{ max: 2, perspective: 1100 }}>
			<div class="cta-inner">
				<h2>Parlons-en</h2>
				<p>La meilleure façon de commencer, c'est d'échanger.<br />Écrivez-moi directement.</p>
				<a href="mailto:elias.treguier@gmail.com" class="cta cta-inverse">Envoyer un email →</a>
				<a href="{base}/contact" class="cta-light">Autres coordonnées</a>
			</div>
		</div>
	</div>
</section>

<style>
	.project-page {
		max-width: 800px;
		margin-inline: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		position: relative;
		z-index: 10;
	}

	.project-head h1 { margin-top: 0.4rem; }
	.project-desc {
		font-size: 14px;
		line-height: 1.55;
		color: var(--text-color);
		max-width: 540px;
		margin-top: 0.4rem;
	}

	.contact-cta { padding: 1rem 0; }
	.cta-card {
		max-width: 65%;
		background: var(--primary);
		border: var(--line) solid var(--primary);
		border-radius: var(--bigger-radius);
		box-shadow: 10px 10px 0 0 var(--accent);
		padding: 3rem 2.8rem;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		transform-style: preserve-3d;
	}
	.cta-inner {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.cta-card h2 {
		font-family: 'artistic', serif;
		font-weight: 800;
		font-size: 38px;
		text-transform: uppercase;
		color: var(--text-ondark);
		line-height: 0.95;
	}
	.cta-card p {
		font-size: 14px;
		line-height: 1.55;
		color: var(--text-muted);
	}
	.cta-inverse {
		background: var(--accent);
		color: var(--accent-color);
		border: 2px solid var(--text-ondark);
		box-shadow: 3px 3px 0 0 var(--text-ondark);
		align-self: flex-start;
	}
	.cta-card .cta-light {
		color: var(--text-ondark);
		border-color: var(--text-ondark);
		align-self: flex-start;
	}

	@media (max-width: 760px) {
		.project-page { padding: 1.2rem; }
		.cta-card { max-width: 100%; }
		.cta-card h2 { font-size: 30px; }
	}
</style>