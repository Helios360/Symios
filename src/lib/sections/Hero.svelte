<script lang="ts">
	import { parallax } from '$lib/motion/parallax';
	import { float } from '$lib/motion/float';
	import { tilt } from '$lib/motion/tilt';

	let heroEl: HTMLElement;
</script>

<section class="hero-section" bind:this={heroEl}>
	<!-- Title terminal window -->
	<div class="terminal-wrapper terminal-title" use:float={{ amp: 8, period: 3.2, phase: 0 }} use:parallax={42}>
		<div class="terminal-panel" use:tilt={{ max: 2.5, perspective: 1000 }}>
			<div class="term-header">
				<span class="term-dot term-dot--red"></span>
				<span class="term-dot term-dot--amber"></span>
				<span class="term-dot term-dot--green"></span>
				<span class="term-title mono-alt">symios:~$</span>
			</div>
			<h1>
				Le futur s'invite
				<span class="accent-line">chez vous</span>
			</h1>
		</div>
	</div>

	<!-- Text + CTA terminal window -->
	<div class="terminal-wrapper terminal-desc" use:float={{ amp: 8, period: 3.2, phase: 0 }} use:parallax={42}>
		<div class="terminal-panel" use:tilt={{ max: 2.5, perspective: 1000 }}>
			<div class="term-header">
				<span class="term-dot term-dot--red"></span>
				<span class="term-dot term-dot--amber"></span>
				<span class="term-dot term-dot--green"></span>
				<span class="term-title mono-alt">symios:~$</span>
			</div>
			<p class="section-index">// MISSION 001 — Déploiement IA</p>
			<p class="hero-desc">
				Hellios conçoit, déploie et documente des agents IA sur-mesure
				pour les entreprises qui migrent. En abonnement, au forfait, ou
				à l'heure — toujours livré avec sa doc.
			</p>
			<div class="button-container">
				<a href="/project" class="cta">Démarrer un projet →</a>
				<a href="/catalogue" class="cta-light">Voir le catalogue</a>
			</div>
		</div>
	</div>
</section>

<style>
	/* ── Layout ── */
	.hero-section {
		min-height: calc(100vh - 62px);
		padding: 2rem;
		position: relative;
		z-index: 10;
	}

	.terminal-title {
		max-width: 70%;
		position: absolute;
		top: 300px;
		left: -7%;
		z-index: 100;
		will-change: transform;
	}
	
	.terminal-desc {
		max-width: 600px;
		position: absolute;
		right: 0;
		top: 40px;
		will-change: transform;
	}
	@media screen and (max-width:1636px){
		.terminal-title{
			max-width: 60%;
			left:5%;
		}
		.terminal-desc {
			right:5%;
		}
	}

	/* ── Terminal window shell ── */
	.terminal-panel {
		border: 2px solid var(--primary);
		border-radius: 14px;
		overflow: hidden;
		background: #1c140d;
		box-shadow: var(--shadow-hard);
		transform-style: preserve-3d;
	}

	/* ── Title inside first terminal ── */
	h1 {
		font-family: 'artistic', serif;
		font-weight: 800;
		font-size: clamp(40px, 6.4vw, 116px);
		line-height: 0.9;
		color: var(--text-ondark);
		text-transform: uppercase;
		letter-spacing: -0.015em;
		padding: 1rem;
	}

	.accent-line {
		color: var(--accent);
	}

	/* ── Content inside second terminal ── */
	.section-index {
		padding: 1.2rem 1rem 0;
		color: var(--accent);
		text-transform: uppercase;
		font-size: 12.5px;
		font-family: 'details', serif;
	}

	.hero-desc {
		padding: 0.6rem 1rem;
		font-size: clamp(14px, 1.1vw, 18px);
		line-height: 1.6;
		color: var(--text-ondark);
		max-width: 520px;
	}

	.button-container {
		padding: 0 1rem 1rem;
		display: flex;
		gap: 1rem;
	}

	/* ── Button overrides for dark terminal bg ── */
	.button-container :global(.cta) {
		border-color: var(--text-ondark);
		box-shadow: 3px 3px 0 0 var(--text-ondark);
	}

	.button-container :global(.cta):hover {
		box-shadow: 5px 5px 0 0 var(--text-ondark);
	}

	.button-container :global(.cta-light) {
		color: var(--text-ondark);
		border-color: var(--text-ondark);
	}
</style>