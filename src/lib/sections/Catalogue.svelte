<script lang="ts">
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
		<p class="section-index">// MISSION 002 — Le catalogue</p>
		<h2>Travaillons ensemble</h2>
		<a href="/shop" class="catalogue-link mono-alt">Tout le catalogue →</a>
	</div>

	<div class="modules-grid">
		{#each modules as module, i}
			<article
				class="module-card"
				class:card-left={i === 0}
				class:card-center={i === 1}
				class:card-right={i === 2}
				use:slideIn={{ dir: ['l', 'u', 'r'][i] as 'l' | 'u' | 'r', dist: 110 }}
				use:float={{ amp: 5, period: 3, phase: i * 2 }}
				use:tilt={{ max: 3, perspective: 900 }}
			>
				<div class="card-head">
					<span class="mono-alt">{module.category || 'Module'}</span>
					<span class="mono-alt price-label">{module.price ? `${module.price}€` : 'Sur-mesure'}</span>
				</div>
				<div class="card-body">
					<h3>{module.title}</h3>
					<p>{module.subtitle}</p>
					{#if module.features && module.features.length}
						<span class="card-features mono">{module.features.join(' · ')}</span>
					{/if}
					<div class="card-foot">
						<a href="/shop" class="card-cta">
							<span>→</span>
						</a>
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

	h2 {
		font-family: 'artistic', serif;
		font-weight: 800;
		font-size: 42px;
		color: var(--primary);
		text-transform: uppercase;
	}

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

	.module-card {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: var(--bigger-radius);
		background-color: var(--surface);
		border: var(--line) solid var(--primary);
		box-shadow: var(--shadow-hard);
		transform-style: preserve-3d;
		will-change: transform;
		transition: box-shadow 0.3s ease;
	}

	.module-card:hover {
		box-shadow: 12px 14px 0 0 var(--primary);
	}

	.card-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 11px 18px;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		background-color: var(--primary);
		color: var(--text-ondark);
	}

	.card-left .card-head { background-color: var(--accent); color: var(--accent-color); }
	.card-center .card-head { background-color: var(--mustard); color: var(--primary); }
	.card-right .card-head { background-color: var(--amber); color: var(--primary); }

	.card-body {
		padding: 24px 22px;
		display: flex;
		flex-direction: column;
		gap: 13px;
		flex: 1;
	}

	.card-body h3 {
		font-family: 'artistic', serif;
		font-size: 22px;
		font-weight: 700;
		color: var(--primary);
		line-height: 1.05;
	}

	.card-body p {
		font-size: 14px;
		line-height: 1.55;
		color: var(--text-color);
	}

	.card-features {
		font-size: 11.5px;
		color: var(--text-muted);
		letter-spacing: 0.02em;
	}

	.card-foot {
		margin-top: auto;
		padding-top: 16px;
		border-top: 1px dashed #c9b894;
		display: flex;
		justify-content: flex-end;
	}

	.card-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: var(--line) solid var(--primary);
		background: var(--surface);
		color: var(--primary);
		font-size: 18px;
		transition: transform 0.2s ease;
	}

	.card-cta:hover {
		transform: translateX(3px);
	}

	.price-label {
		font-size: 11.5px;
		opacity: 0.9;
	}
</style>