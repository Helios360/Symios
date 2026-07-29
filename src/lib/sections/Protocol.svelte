<script lang="ts">
	import { reveal } from '$lib/motion/reveal';
	import { slideIn } from '$lib/motion/slideIn';
	import { float } from '$lib/motion/float';
	import { scrollStore, type ScrollState } from '$lib/motion/scrollStore';

	let { } = $props();

	let progressBarEl: HTMLDivElement;
	let sectionEl: HTMLElement;
	let progress = $state(0);

	let unsub: (() => void) | null = null;

	function onScroll(scroll: ScrollState) {
		if (!sectionEl) return;
		const rect = sectionEl.getBoundingClientRect();
		const vh = scroll.vh;
		const sectionHeight = rect.height;
		const sectionTop = rect.top;

		// Progress from 0 to 1 as the section scrolls into view
		const p = Math.min(Math.max((vh * 0.8 - sectionTop) / (sectionHeight + vh * 0.2), 0), 1);
		progress = p;

		if (progressBarEl) {
			progressBarEl.style.width = `${p * 100}%`;
		}
	}

	import { onMount } from 'svelte';

	onMount(() => {
		unsub = scrollStore.subscribe(onScroll);
		return () => {
			if (unsub) unsub();
		};
	});
</script>

<section class="protocol-section" bind:this={sectionEl} use:reveal>
	<p class="section-index">// MISSION 003 — Protocole de mission</p>

	<div class="steps-track">
		<div class="steps-grid">
			<div class="step" use:slideIn={{ dir: 'u', dist: 60 }}>
				<div class="step-marker">
					<span class="step-dot" aria-hidden="true"></span>
					<span class="step-num">01</span>
				</div>
				<div class="step-body" use:float={{ amp: 4, period: 3.4, phase: 0 }}>
					<h4>Audit</h4>
					<p>On cartographie vos systèmes et vos objectifs de migration.</p>
				</div>
			</div>
			<div class="step" use:slideIn={{ dir: 'u', dist: 60 }}>
				<div class="step-marker">
					<span class="step-dot" aria-hidden="true"></span>
					<span class="step-num">02</span>
				</div>
				<div class="step-body" use:float={{ amp: 4, period: 3.2, phase: 1.5 }}>
					<h4>Conception</h4>
					<p>Architecture de l'agent, choix des modèles, plan de déploiement.</p>
				</div>
			</div>
			<div class="step" use:slideIn={{ dir: 'u', dist: 60 }}>
				<div class="step-marker">
					<span class="step-dot" aria-hidden="true"></span>
					<span class="step-num">03</span>
				</div>
				<div class="step-body" use:float={{ amp: 4, period: 3.6, phase: 3 }}>
					<h4>Déploiement</h4>
					<p>Mise en production, intégration à vos outils, tests réels.</p>
				</div>
			</div>
			<div class="step" use:slideIn={{ dir: 'u', dist: 60 }}>
				<div class="step-marker">
					<span class="step-dot" aria-hidden="true"></span>
					<span class="step-num">04</span>
				</div>
				<div class="step-body" use:float={{ amp: 4, period: 3, phase: 4.5 }}>
					<h4>Documentation</h4>
					<p>Tout est documenté et transmis. Vos équipes restent autonomes.</p>
				</div>
			</div>
		</div>

		<!-- Timeline rail — runs through the markers' vertical center -->
		<div class="track-rail" aria-hidden="true">
			<div class="track-progress" bind:this={progressBarEl}></div>
		</div>
	</div>
</section>

<style>
	.protocol-section {
		padding: 4rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		position: relative;
		z-index: 10;
	}

	.steps-track {
		position: relative;
	}

	/* ── Horizontal progress rail ── */
	.track-rail {
		position: absolute;
		top: 22px;
		left: 0;
		right: 0;
		height: 2px;
		background: #c9b894;
		z-index: 0;
		pointer-events: none;
	}

	.track-progress {
		height: 100%;
		width: 0%;
		background: var(--accent);
		transition: width 0.15s linear;
	}

	/* ── 4-column grid ── */
	.steps-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0;
		position: relative;
		z-index: 1;
	}

	/* ── Each step: marker on the rail, content below ── */
	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: 0 0.75rem;
		gap: 1rem;
	}

	.step-marker {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.step-dot {
		display: block;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2px solid var(--primary);
		background: var(--background);
		position: relative;
		z-index: 2;
	}

	.step-num {
		font-size: 36px;
		font-weight: 800;
		color: var(--accent);
		font-family: 'artistic', serif;
		line-height: 1;
		margin-top: -10px;
		position: relative;
		z-index: 3;
		/* Text is pierced by the rail beneath — we keep the number readable
		   by overlaying it above the dot */
		text-shadow:
			-2px -2px 0 var(--background),
			 2px -2px 0 var(--background),
			-2px  2px 0 var(--background),
			 2px  2px 0 var(--background),
			 0px -2px 0 var(--background),
			 0px  2px 0 var(--background),
			-2px  0px 0 var(--background),
			 2px  0px 0 var(--background);
	}

	/* ── Content below the timeline ── */
	.step-body {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.step-body h4 {
		font-family: 'artistic', sans-serif;
		font-size: 18px;
		font-weight: 600;
		text-transform: uppercase;
		color: var(--primary);
	}

	.step-body p {
		font-size: 13px;
		line-height: 1.5;
		color: var(--text-color);
	}
</style>