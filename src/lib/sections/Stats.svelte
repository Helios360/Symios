<script lang="ts">
	import { reveal } from '$lib/motion/reveal';
	import { countUp } from '$lib/motion/countUp';
	import { float } from '$lib/motion/float';

	type Stat = { number: string; title: string; value: number };

	let { stats = [] as Stat[] } = $props();
</script>

<section class="stats-section" use:reveal>
	<div class="stats-inner">
		{#each stats as stat, i}
			<div class="stat" class:stat-first={i === 0} class:stat-last={i === stats.length - 1} use:float={{ amp: 4, period: 3.3, phase: i * 1.2 }}>
				<span class="stat-number" use:countUp={{ to: stat.value, suffix: stat.number.replace(/[\d,.\s]/g, '') }}>
					{stat.number}
				</span>
				<span class="stat-label mono-alt">{stat.title}</span>
			</div>
		{/each}
	</div>
</section>

<style>
	.stats-section {
		width: 100vw;
		margin-inline: calc(50% - 50vw);
		background-color: var(--background-accent);
		border-top: var(--line) solid var(--primary);
		border-bottom: var(--line) solid var(--primary);
		position: relative;
		z-index: 10;
	}

	.stats-inner {
		max-width: 1440px;
		margin-inline: auto;
		display: grid;
		grid-auto-flow: column;
		grid-auto-columns: 1fr;
		min-height: 120px;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: left;
		justify-content: center;
		padding: 0 2rem;
		gap: 0.5rem;
		border-left: 1px solid var(--text-muted);
	}

	.stat-first {
		border-left: none;
	}
	.stat-number {
		font-size: 38px;
		font-weight: 800;
		color: var(--accent);
		font-family: 'artistic', serif;
		line-height: 1;
	}

	.stat-label {
		font-size: 0.8rem;
		opacity: 0.8;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
</style>