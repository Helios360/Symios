<script lang="ts">
	import { resolve } from '$app/paths';
	import { slideIn } from '$lib/motion/slideIn';
	import { float } from '$lib/motion/float';
	import { tilt } from '$lib/motion/tilt';

	type Module = {
		id: number;
		title: string;
		subtitle: string;
		price?: number;
		category?: string;
		features?: string[];
	};

	let { modules = [] as Module[] } = $props();
</script>

<section class="catalogue-section">
	<div class="catalogue-header">
		<p class="section-index">// 002 — Le catalogue</p>
		<h2>Travaillons ensemble</h2>
		<a href="{resolve('/shop')}" class="catalogue-link mono-alt">Tout le catalogue →</a>
	</div>

	<div class="modules-grid">
		{#each modules as module, i}
			<article
				class="card"
				class:card-left={i === 0}
				class:card-center={i === 1}
				class:card-right={i === 2}
				use:slideIn={{ dir: ['l', 'u', 'r'][i] as 'l' | 'u' | 'r', dist: 110 }}
				use:float={{ amp: 5, period: 3, phase: i * 2 }}
				use:tilt={{ max: 3, perspective: 900 }}
			>
				<div class="card-head">
					<span class="mono-alt">{module.category || 'Module'}</span>
				</div>
				<div class="card-body">
					<h3>{module.title}</h3>
					<p>{module.subtitle}</p>
					{#if module.features && module.features.length}
						<span class="card-features mono">{module.features.join(' · ')}</span>
					{/if}
					<div class="card-foot">
						<span class="price-label mono-alt">{module.price ? `${module.price}€` : 'Sur-mesure'}</span>
						<a href="{resolve('/shop')}" class="cta-light">Voir →</a>
					</div>
				</div>
			</article>
		{/each}
	</div>
</section>

<style>
	.catalogue-section {
		padding: 4rem 2rem;
		position: relative;
		z-index: 10;
	}

	.catalogue-header {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		margin-bottom: 2rem;
	}

	/* h2 styled globally in app.css */

	.catalogue-link {
		font-size: 13px;
		text-transform: uppercase;
		border-bottom: 2px solid var(--accent);
		width: fit-content;
		letter-spacing: 0.08em;
	}

	.modules-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 24px;
		align-items: start;
	}

	/* ── Card head colors ── */
	.card-left .card-head { background-color: var(--accent); color: var(--accent-color); }
	.card-center .card-head { background-color: var(--mustard); color: var(--primary); }
	.card-right .card-head { background-color: var(--amber); color: var(--primary); }
</style>