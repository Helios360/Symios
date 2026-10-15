<script lang="ts">
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { reveal } from '$lib/motion/reveal';
	import { float } from '$lib/motion/float';
	import { tilt } from '$lib/motion/tilt';
	import { slideIn } from '$lib/motion/slideIn';
	import type { Article } from '$lib/server/articles';

	let {
		article,
		action = '?/addToCart',
		authenticated = false,
		index = 0
	}: { article: Article; action?: string; authenticated: boolean; index: number } = $props();

	const euro = new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: 'EUR',
		maximumFractionDigits: 0
	});
	const priceLabel = (price: number) => (price === 0 ? 'Gratuit' : euro.format(price));

	let added = $state(false);
	let timer: ReturnType<typeof setTimeout>;
	const submitAdd = () =>
		async ({ result, update }: any) => {
			await update();
			if (result.type === 'success') {
				added = true;
				clearTimeout(timer);
				timer = setTimeout(() => (added = false), 2000);
			}
		};

	const slideDirs = ['l', 'u', 'r', 'u', 'l', 'u'] as const;
</script>

<article
	class="card"
	data-cat={article.categoryKey}
	use:reveal={{ threshold: 0.08 }}
	use:slideIn={{ dir: slideDirs[index % slideDirs.length], dist: 80 }}
	use:float={{ amp: 5, period: 3.4, phase: index * 1.3 }}
	use:tilt={{ max: 2.5, perspective: 900 }}
>
	<div class="card-head">
		<span>{article.category}</span>
		<span>{priceLabel(article.price)}</span>
	</div>
	<div class="card-body">
		<h3>{article.title}</h3>
		<p>{article.subtitle}</p>
		{#if article.features.length}
			<span class="card-features">{article.features.join(' · ')}</span>
		{/if}
		<div class="card-foot">
			<span class="price">
				<span class="price-amount">{priceLabel(article.price)}</span>
				<span class="price-period mono-alt">{article.category}</span>
			</span>
			{#if authenticated}
				<form method="POST" {action} use:enhance={submitAdd}>
					<input type="hidden" name="articleId" value={article.id} />
					<button type="submit" class="cta" class:added>{added ? 'ajouté ✓' : '+ panier'}</button>
				</form>
			{:else}
				<a href="{resolve('/account')}" class="cta" title="Connectez-vous pour commander">connexion →</a>
			{/if}
		</div>
	</div>
</article>

<style>
	/* ── Category head colors ── */
	.card[data-cat='abonnement'] .card-head { background-color: var(--accent); color: var(--accent-color); }
	.card[data-cat='forfait'] .card-head { background-color: var(--mustard); color: var(--primary); }
	.card[data-cat='heures'] .card-head { background-color: var(--amber); color: var(--primary); }
	.card[data-cat='formation'] .card-head { background-color: var(--olive); color: var(--accent-color); }

	/* ── Price block ── */
	.price {
		display: flex;
		flex-direction: column;
	}
	.price-amount {
		font-family: 'artistic', serif;
		font-size: 23px;
		font-weight: 800;
		color: var(--primary);
		line-height: 1;
	}
	.price-period {
		font-size: 11px;
		color: var(--text-muted);
		margin-top: 3px;
	}

	/* ── CTA overrides ── */
	.card-foot :global(.cta) {
		font-size: 13.5px;
	}
	.card-foot :global(.cta.added) {
		background-color: var(--olive);
		color: var(--text-ondark);
	}
</style>
