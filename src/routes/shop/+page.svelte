<script lang="ts">
	import ProductCard from '$lib/components/product-card.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let query = $state('');
	let sort = $state('pertinence');
	let filter = $state('tous');

	const haystack = (a: PageData['articles'][number]) =>
		`${a.title} ${a.subtitle} ${a.category} ${a.features.join(' ')}`.toLowerCase();

	let items = $derived.by(() => {
		const q = query.trim().toLowerCase();
		let list = data.articles.filter((a) => filter === 'tous' || a.categoryKey === filter);
		if (q) list = list.filter((a) => haystack(a).includes(q));
		list = [...list];
		if (sort === 'prix-asc') list.sort((x, y) => x.price - y.price);
		else if (sort === 'prix-desc') list.sort((x, y) => y.price - x.price);
		else if (sort === 'nom') list.sort((x, y) => x.title.localeCompare(y.title, 'fr'));
		return list;
	});

	let countLabel = $derived(`${items.length} ${items.length > 1 ? 'résultats' : 'résultat'}`);

	function reset() {
		query = '';
		filter = 'tous';
	}
</script>

<section class="catalog">
	<p class="section-index">// LA BOUTIQUE</p>
	<h1>TOUT LE<br />CATALOGUE</h1>
	<p>
		Abonnements, forfaits, heures, formations et ressources — chaque ligne repart documentée.<br />
		Cherchez, triez, ajoutez au panier.
	</p>
</section>

<!-- TOOLBAR -->
<section class="toolbar">
	<div class="toolbar-row">
		<div class="field search">
			<span class="field-label" aria-hidden="true">⌕</span>
			<input
				type="text"
				bind:value={query}
				placeholder="rechercher un article, un abonnement…"
				aria-label="Rechercher" />
			{#if query}
				<button type="button" class="clear" onclick={() => (query = '')}>effacer ✕</button>
			{/if}
		</div>
		<div class="field">
			<span class="field-label">trier</span>
			<div class="select-wrap">
				<select bind:value={sort} aria-label="Trier">
					<option value="pertinence">Pertinence</option>
					<option value="prix-asc">Prix croissant</option>
					<option value="prix-desc">Prix décroissant</option>
					<option value="nom">Nom A → Z</option>
				</select>
				<span class="caret" aria-hidden="true">▼</span>
			</div>
		</div>
	</div>

	<div class="toolbar-meta">
		<div class="chips">
			<button class="chip" aria-pressed={filter === 'tous'} onclick={() => (filter = 'tous')}>
				Tous · {data.articles.length}
			</button>
			{#each data.categories as cat}
				<button class="chip" aria-pressed={filter === cat.key} onclick={() => (filter = cat.key)}>
					{cat.name} · {cat.count}
				</button>
			{/each}
		</div>
		<span class="count mono-alt">{countLabel}</span>
	</div>
</section>

<!-- GRID -->
<section class="grid-wrap">
	{#if items.length}
		<div class="grid">
			{#each items as item (item.id)}
				<ProductCard article={item} authenticated={data.authenticated} />
			{/each}
		</div>
	{:else}
		<div class="empty">
			<div class="empty-bar">
				<span class="dots"><i></i><i></i><i></i></span>
				<span class="mono">search.sh</span>
			</div>
			<div class="empty-body mono">
				<div class="cmd">&gt; symios shop --grep "{query}"</div>
				<div class="out">0 résultat dans ce rayon.</div>
				<button type="button" class="cta reset" onclick={reset}>Réinitialiser →</button>
			</div>
		</div>
	{/if}
</section>

<style>
	.catalog {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 2rem 2rem 0.5rem;
	}

	/* ── Toolbar ─────────────────────────────────────────── */
	.toolbar {
		padding: 0.5rem 2rem 0;
		display: flex;
		flex-direction: column;
		gap: 1.4rem;
	}
	.toolbar-row {
		display: flex;
		gap: 18px;
		flex-wrap: wrap;
	}
	.search {
		flex: 1;
		min-width: 280px;
	}
	.search input {
		flex: 1;
	}
	.clear {
		border: none;
		background: transparent;
		padding: 0 16px;
		cursor: pointer;
		font-family: 'details', monospace;
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.select-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}
	.select-wrap .caret {
		position: absolute;
		right: 16px;
		pointer-events: none;
		color: var(--text-color);
		font-size: 11px;
	}
	.toolbar-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		flex-wrap: wrap;
	}
	.chips {
		display: flex;
		gap: 11px;
		flex-wrap: wrap;
	}
	.count {
		font-size: 12px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	/* ── Grille ──────────────────────────────────────────── */
	.grid-wrap {
		padding: 1.8rem 2rem;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 24px;
		align-items: start;
	}

	/* ── État vide (terminal) ────────────────────────────── */
	.empty {
		max-width: 560px;
		margin-inline: auto;
		overflow: hidden;
		border: var(--line) solid var(--primary);
		border-radius: var(--bigger-radius);
		box-shadow: var(--shadow-hard);
		background-color: #1c140d;
	}
	.empty-bar {
		display: flex;
		align-items: center;
		gap: 13px;
		height: 40px;
		padding: 0 18px;
		background-color: var(--primary);
		color: var(--text-ondark);
		font-size: 12px;
	}
	.dots {
		display: flex;
		gap: 7px;
	}
	.dots i {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		display: block;
	}
	.dots i:nth-child(1) { background: var(--accent); }
	.dots i:nth-child(2) { background: var(--mustard); }
	.dots i:nth-child(3) { background: var(--text-muted); }
	.empty-body {
		padding: 26px 24px;
		font-size: 13.5px;
		line-height: 1.9;
	}
	.empty-body .cmd { color: var(--amber); }
	.empty-body .out { color: #c3b294; }
	.empty-body .reset {
		display: inline-block;
		margin-top: 16px;
		cursor: pointer;
	}

	@media (max-width: 614px) {
		.catalog,
		.toolbar,
		.grid-wrap {
			padding-inline: 1.2rem;
		}
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
