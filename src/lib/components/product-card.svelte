<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Article } from '$lib/server/articles';

	let {
		article,
		action = '?/addToCart',
		authenticated = false
	}: { article: Article; action?: string; authenticated?: boolean } = $props();

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
</script>

<article class="product" data-cat={article.categoryKey}>
	<div class="product-head mono-alt">
		<span>{article.category}</span>
		<span>{priceLabel(article.price)}</span>
	</div>
	<div class="product-body">
		<h3>{article.title}</h3>
		<p>{article.subtitle}</p>
		{#if article.features.length}
			<span class="features mono">{article.features.join(' · ')}</span>
		{/if}
		<div class="product-foot">
			<span class="price">
				<span class="amount">{priceLabel(article.price)}</span>
				<span class="period mono-alt">{article.category}</span>
			</span>
			{#if authenticated}
				<form method="POST" {action} use:enhance={submitAdd}>
					<input type="hidden" name="articleId" value={article.id} />
					<button type="submit" class="cta" class:added>{added ? 'ajouté ✓' : '+ panier'}</button>
				</form>
			{:else}
				<a href="/account" class="cta login" title="Connectez-vous pour commander">connexion →</a>
			{/if}
		</div>
	</div>
</article>

<style>
	.product {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		background-color: var(--surface);
		border: var(--line) solid var(--primary);
		border-radius: var(--bigger-radius);
		box-shadow: var(--shadow-hard);
	}
	.product-head {
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
	/* Couleur d'en-tête par catégorie */
	.product[data-cat='abonnement'] .product-head { background-color: var(--accent); color: var(--accent-color); }
	.product[data-cat='forfait'] .product-head { background-color: var(--mustard); color: var(--primary); }
	.product[data-cat='heures'] .product-head { background-color: var(--amber); color: var(--primary); }
	.product[data-cat='formation'] .product-head { background-color: var(--olive); color: var(--accent-color); }

	.product-body {
		padding: 24px 22px;
		display: flex;
		flex-direction: column;
		gap: 13px;
		flex: 1;
	}
	.product-body h3 {
		font-family: 'artistic', serif;
		font-size: 22px;
		font-weight: 700;
		color: var(--primary);
		line-height: 1.05;
	}
	.product-body p {
		font-size: 14px;
		line-height: 1.55;
		color: var(--text-color);
	}
	.features {
		font-size: 11.5px;
		color: var(--text-muted);
		letter-spacing: 0.02em;
	}
	.product-foot {
		margin-top: auto;
		padding-top: 16px;
		border-top: 1px dashed #c9b894;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 12px;
	}
	.price {
		display: flex;
		flex-direction: column;
	}
	.amount {
		font-family: 'artistic', serif;
		font-size: 23px;
		font-weight: 800;
		color: var(--primary);
		line-height: 1;
	}
	.period {
		font-size: 11px;
		color: var(--text-muted);
		margin-top: 3px;
	}
	.product-foot .cta {
		cursor: pointer;
		font-size: 13.5px;
		box-shadow: var(--shadow-hard-sm);
	}
	.product-foot .cta.login {
		text-decoration: none;
		display: inline-block;
	}
	.product-foot .cta.added {
		background-color: var(--olive, #6b7d3a);
		color: var(--text-ondark);
	}
</style>
