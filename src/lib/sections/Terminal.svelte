<script lang="ts">
	import { onMount } from 'svelte';
	import { reveal } from '$lib/motion/reveal';
	import { float } from '$lib/motion/float';
	import { tilt } from '$lib/motion/tilt';

	let lines = $state<string[]>([]);
	let visibleCount = $state(0);
	let timer: ReturnType<typeof setTimeout> | null = null;

	const terminalLines = [
		'> symios init --client',
		'✓ audit des systèmes legacy',
		'✓ architecture agent définie',
		'✓ modèles sélectionnés',
		'✓ déploiement CI/CD configuré',
		'✓ tests passés (12/12)',
		'✓ documentation générée',
		'> livraison : 14 jours ouvrés',
		'symios:~$'
	];

	let sectionEl: HTMLElement;
	let observer: IntersectionObserver | null = null;

	function startTyping() {
		visibleCount = 0;
		lines = terminalLines;

		let i = 0;
		function typeNext() {
			if (i < lines.length) {
				visibleCount = i + 1;
				i++;
				timer = setTimeout(typeNext, 320);
			} else {
				// Wait, then loop
				timer = setTimeout(() => {
					startTyping();
				}, 3600);
			}
		}
		typeNext();
	}

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						startTyping();
					}
				}
			},
			{ threshold: 0.3 }
		);
		if (sectionEl) observer.observe(sectionEl);
		return () => {
			if (observer) observer.disconnect();
			if (timer) clearTimeout(timer);
		};
	});
</script>

<section class="terminal-section" bind:this={sectionEl} use:reveal>
	<div class="terminal-col-left" use:float={{ amp: 5, period: 3.5, phase: 1 }}>
		<p class="section-index">// MISSION 004 — Console</p>
		<h2>Un agent,<br />une console</h2>
		<p class="terminal-desc">
			Chaque mission commence par un terminal ouvert.
			Écoute, analyse, exécution — pas d'interface superflue.
		</p>
	</div>
	<div class="terminal-col-right" use:float={{ amp: 6, period: 3, phase: 0 }}>
		<div class="terminal-window" use:tilt={{ max: 2.5, perspective: 1000 }}>
			<div class="term-header">
				<span class="term-dot term-dot--red"></span>
				<span class="term-dot term-dot--amber"></span>
				<span class="term-dot term-dot--green"></span>
				<span class="term-title mono-alt">deploy.sh — bash</span>
			</div>
			<div class="win-body">
				{#each lines.slice(0, visibleCount) as line}
					<div class="win-line" class:amber={line.startsWith('>')} class:green={line.startsWith('✓')} class:dim={line.startsWith('symios')}>
						{line}
						{#if line === lines[visibleCount - 1]}
							<span class="cursor-blink"></span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.terminal-section {
		display: grid;
		grid-template-columns: 0.86fr 1.14fr;
		padding: 4rem 2rem;
		gap: 2rem;
		align-items: center;
		position: relative;
		z-index: 10;
	}

	.terminal-col-left {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h2 {
		font-family: 'artistic', serif;
		font-weight: 800;
		font-size: 42px;
		color: var(--primary);
		text-transform: uppercase;
	}

	.terminal-desc {
		font-size: 14px;
		line-height: 1.6;
		color: var(--text-color);
	}

	/* Terminal window */
	.terminal-window {
		border: 2px solid var(--primary);
		border-radius: 14px;
		overflow: hidden;
		background: #1c140d;
		box-shadow: var(--shadow-hard);
	}

	.win-body {
		padding: 18px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-height: 250px;
	}

	.win-line {
		font-family: 'subtext', monospace;
		font-size: 12.5px;
		line-height: 1.72;
	}

	.win-line.amber { color: #e0982f; }
	.win-line.green { color: #9fb37a; }
	.win-line.dim { color: #b6a886; }

	.cursor-blink {
		display: inline-block;
		width: 8px;
		height: 13px;
		background: #e0982f;
		vertical-align: -2px;
		animation: symios-blink 1.1s steps(1, end) infinite;
	}
</style>