<script lang="ts">
	import { resolve } from '$app/paths';
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
			<p class="section-index">// 001 — Prestation IA</p>
			<p class="hero-desc">
				Je conçois, déploie et documente des agents IA sur-mesure
				pour les entreprises qui souhaitent avancer. En abonnement, au forfait, ou
				à l'heure — toujours livré avec sa documentation.
			</p>
			<div class="button-container">
				<a href="{resolve('/project')}" class="cta">Démarrer un projet →</a>
				<a href="{resolve('/shop')}" class="cta-light">Voir le catalogue</a>
			</div>
		</div>
	</div>
</section>

<style>
	.hero-section {
		min-height: calc(100vh - 62px);
		padding: 2rem 3rem;
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.terminal-title {
		max-width: 60%;
		position: absolute;
		top: 300px;
		left: -3%;
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

	@media screen and (max-width: 1636px) {
		.terminal-title {
			max-width: 60%;
			top:40%;
			left: 5%;
		}
		.terminal-desc {
			right: 5%;
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

	h1 {
		font-family: 'Monoton', sans-serif;
		font-weight: 400;
		font-size: clamp(30px, 4vw, 72px);
		line-height: 0.9;
		color: var(--text-ondark);
		text-transform: uppercase;
		letter-spacing: -0.015em;
		padding: 1rem;
	}

	.accent-line {
		color: var(--accent);
	}

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

	/* ── Responsive: stack terminal panels vertically on mobile */
	@media (max-width: 760px) {
		.hero-section {
			min-height: auto;
			padding: 1rem;
			display: flex;
			flex-direction: column;
			gap: 2rem;
			position: relative;
		}
		.terminal-title,
		.terminal-desc {
			position: relative;
			top: auto;
			left: auto;
			right: auto;
			max-width: 100%;
			will-change: auto;
		}
		h1 {
			font-size: clamp(24px, 6vw, 36px);
			padding: 0.8rem;
		}
		.hero-desc {
			font-size: 14px;
			max-width: 100%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.terminal-wrapper {
			will-change: auto;
		}
	}
</style>