<script lang="ts">
	import { resolve, asset } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const fmtFull = (d: string) => new Date(d).toLocaleDateString('fr-FR', {
		day: 'numeric', month: 'long', year: 'numeric'
	});

	let ogImage = $derived(data.post.cover_image_key
		? `${asset('/uploads/')}${data.post.cover_image_key}`
		: asset('/images/icon.png'));
</script>

<svelte:head>
	<title>{data.post.title} | Symios</title>
	<meta name="description" content={data.post.excerpt || data.post.title} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.post.title} />
	<meta property="og:description" content={data.post.excerpt || data.post.title} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:alt" content={data.post.title} />
	<meta property="article:published_time" content={data.post.published_at} />
	<meta property="article:author" content={data.post.author_name || ''} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.post.title} />
	<meta name="twitter:description" content={data.post.excerpt || data.post.title} />
	<meta name="twitter:image" content={ogImage} />
</svelte:head>

<section class="post-page">
	<a href="{resolve('/blog')}" class="back mono-alt">← Retour au blog</a>

	<article class="post-article" itemscope itemtype="https://schema.org/Article">
		<meta itemprop="datePublished" content={data.post.published_at} />
		<meta itemprop="author" content={data.post.author_name || ''} />
		<header class="post-header">
			<p class="section-index">// ARTICLE</p>
			<h1 itemprop="headline">{data.post.title}</h1>
			<div class="post-meta mono-alt">
				<time datetime={data.post.published_at}>{fmtFull(data.post.published_at)}</time>
				{data.post.author_name ? ` · ${data.post.author_name}` : ''}
			</div>
			{#if data.post.excerpt}
				<p class="post-excerpt" itemprop="description">{data.post.excerpt}</p>
			{/if}
		</header>

		<div class="post-content" itemprop="articleBody">
			{@html data.post.content}
		</div>
	</article>

	<footer class="post-footer">
		<a href="{resolve('/blog')}" class="mono-alt">← Tous les articles</a>
	</footer>
</section>

<style>
	.post-page {
		max-width: 800px;
		margin-inline: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		position: relative;
		z-index: 10;
	}

	.back {
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		text-decoration: none;
	}
	.back:hover { color: var(--accent); }

	.post-article {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.post-header h1 {
		margin-top: 0.3rem;
		line-height: 1.05;
	}

	.post-meta {
		font-size: 12px;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		text-transform: uppercase;
	}

	.post-excerpt {
		font-size: 16px;
		line-height: 1.55;
		color: var(--text-color);
		padding: 1rem 0 0;
		border-top: 1px dashed #c9b894;
	}

	.post-content {
		font-size: 15.5px;
		line-height: 1.75;
		color: var(--text-color);
	}
	.post-content :global(h2) {
		font-family: 'Monoton', sans-serif;
		font-size: 28px;
		font-weight: 700;
		color: var(--primary);
		margin: 2rem 0 0.8rem;
	}
	.post-content :global(h3) {
		font-family: 'Monoton', sans-serif;
		font-size: 20px;
		font-weight: 600;
		color: var(--primary);
		margin: 1.6rem 0 0.6rem;
	}
	.post-content :global(p) {
		margin-bottom: 1rem;
	}
	.post-content :global(ul), .post-content :global(ol) {
		padding-left: 1.5rem;
		margin-bottom: 1rem;
		list-style: revert;
	}
	.post-content :global(li) {
		margin-bottom: 0.3rem;
	}
	.post-content :global(blockquote) {
		border-left: 3px solid var(--accent);
		padding: 0.8rem 1rem;
		margin: 1.2rem 0;
		background: var(--background-accent);
		border-radius: var(--smaller-radius);
		font-style: italic;
	}
	.post-content :global(code) {
		font-family: 'subtext', monospace;
		font-size: 13px;
		background: var(--background-accent);
		padding: 2px 6px;
		border-radius: 4px;
	}
	.post-content :global(pre) {
		background: #1c140d;
		color: var(--text-ondark);
		padding: 1rem;
		border-radius: var(--smaller-radius);
		overflow-x: auto;
		margin: 1rem 0;
	}
	.post-content :global(pre code) {
		background: none;
		padding: 0;
		color: inherit;
	}
	.post-content :global(a) {
		color: var(--accent);
		text-decoration: underline;
	}
	.post-content :global(img) {
		max-width: 100%;
		border-radius: var(--smaller-radius);
		border: var(--line) solid var(--primary);
		margin: 1.2rem 0;
	}

	.post-footer {
		border-top: 1px dashed #c9b894;
		padding-top: 1.5rem;
	}
	.post-footer a {
		font-size: 13px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}

	@media (max-width: 640px) {
		.post-page { padding: 1.2rem; }
		.post-header h1 { font-size: 28px; }
		.post-content { font-size: 14.5px; }
	}
</style>