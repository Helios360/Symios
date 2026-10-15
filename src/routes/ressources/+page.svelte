<script lang="ts">
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/motion/reveal';
</script>

<svelte:head>
	<title>Ressources | Symios</title>
	<meta name="description" content="Ressources Symios — articles, guides, templates et outils autour des agents IA et de l'automatisation." />
</svelte:head>

<section class="ressources-page" use:reveal>
	<header class="ressources-head">
		<p class="section-index">// RESSOURCES</p>
		<h1>Ressources</h1>
		<p class="ressources-desc">
			Guides, templates, comparatifs et outils autour des agents IA,
			de l'automatisation et de l'infrastructure souveraine.
		</p>
	</header>

	<div class="placeholder-empty">
		<div class="terminal-card">
			<div class="term-header">
				<span class="term-dot term-dot--red"></span>
				<span class="term-dot term-dot--amber"></span>
				<span class="term-dot term-dot--green"></span>
				<span class="term-title mono-alt">ressources.sh</span>
			</div>
			<div class="terminal-body mono">
				<div class="cmd">&gt; symios ressources --list</div>
				<div class="out">Bibliothèque en construction. Revenez bientôt !</div>
				<a href="{resolve('/blog')}" class="cta-light" style="margin-top:1rem;display:inline-block">Voir le blog →</a>
			</div>
		</div>
	</div>
</section>

<style>
	.ressources-page {
		max-width: 1000px;
		margin-inline: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		position: relative;
		z-index: 10;
	}

	.ressources-head h1 { margin-top: 0.4rem; }
	.ressources-desc {
		font-size: 14px;
		line-height: 1.55;
		color: var(--text-color);
		max-width: 540px;
	}

	.placeholder-empty {
		max-width: 560px;
		margin-inline: auto;
		width: 100%;
	}

	.terminal-card {
		overflow: hidden;
		border: var(--line) solid var(--primary);
		border-radius: var(--bigger-radius);
		box-shadow: var(--shadow-hard);
		background-color: #1c140d;
	}

	.terminal-body {
		padding: 26px 24px;
		font-size: 13.5px;
		line-height: 1.9;
	}
	.terminal-body .cmd { color: var(--amber); }
	.terminal-body .out { color: #c3b294; }

	@media (max-width: 640px) {
		.ressources-page { padding: 1.2rem; }
	}
</style>