<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const fmtDate = (d: string | null, full = false) => {
		if (!d) return '';
		return new Date(d).toLocaleDateString('fr-FR', full
			? { day: 'numeric', month: 'long', year: 'numeric' }
			: { dateStyle: 'short' }
		);
	};
</script>

<svelte:head>
	<title>Blog | Symios</title>
	<meta name="description" content="Articles, guides et réflexions autour des agents IA, de l'automatisation et du déploiement." />
</svelte:head>

<section class="blog-page">
	<header class="blog-head">
		<p class="section-index">// LE BLOG</p>
		<h1>Articles &amp; réflexions</h1>
		<p class="blog-desc">
			Agents IA, automatisation, déploiement, open-source — tout ce qui touche à l'ingénierie pratique.
		</p>
	</header>

	{#if data.posts.length}
		<div class="posts-list">
			{#each data.posts as post}
				<article class="post-card panel">
					<div class="post-card-head">
						<span class="mono-alt">{fmtDate(post.published_at, false)}</span>
						<span class="mono-alt">{post.author_name}</span>
					</div>
					<div class="post-card-body">
						<h2><a href="{resolve('/blog/{post.slug')}}">{post.title}</a></h2>
						{#if post.excerpt}
							<p>{post.excerpt}</p>
						{/if}
						<a href="{resolve('/blog/{post.slug')}}" class="cta-light">Lire l'article →</a>
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<div class="empty">
			<div class="empty-bar">
				<span class="term-dot term-dot--red"></span>
				<span class="term-dot term-dot--amber"></span>
				<span class="term-dot term-dot--green"></span>
				<span class="term-title mono-alt">blog.sh</span>
			</div>
			<div class="empty-body mono">
				<div class="cmd">&gt; symios blog --list --published</div>
				<div class="out">Aucun article publié pour le moment. Revenez bientôt !</div>
			</div>
		</div>
	{/if}
</section>

<style>
	.blog-page {
		max-width: 1000px;
		margin-inline: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		position: relative;
		z-index: 10;
	}

	.blog-head h1 { margin-top: 0.4rem; }
	.blog-desc {
		font-size: 14px;
		line-height: 1.55;
		color: var(--text-color);
		max-width: 540px;
	}

	.posts-list {
		display: flex;
		flex-direction: column;
		gap: 1.4rem;
	}

	.post-card {
		overflow: hidden;
		transition: box-shadow 0.2s;
	}
	.post-card:hover {
		box-shadow: 8px 8px 0 0 var(--primary);
	}

	.post-card-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 18px;
		background: var(--primary);
		color: var(--text-ondark);
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.post-card-body {
		padding: 1.5rem 1.8rem;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.post-card-body h2 {
		font-family: 'Monoton', sans-serif;
		font-size: 24px;
		font-weight: 700;
		color: var(--primary);
		line-height: 1.15;
	}
	.post-card-body h2 a { text-decoration: none; }
	.post-card-body h2 a:hover { color: var(--accent); }

	.post-card-body p {
		font-size: 14px;
		line-height: 1.5;
		color: var(--text-color);
	}

	.post-card-body .cta-light {
		align-self: flex-start;
		font-size: 13px;
	}

	/* ── Empty state (terminal) ── */
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
		border-bottom: 1px solid #4a3a28;
	}
	.empty-bar .term-title { margin-left: auto; }
	.empty-body {
		padding: 26px 24px;
		font-size: 13.5px;
		line-height: 1.9;
	}
	.empty-body .cmd { color: var(--amber); }
	.empty-body .out { color: #c3b294; }

	@media (max-width: 640px) {
		.blog-page { padding: 1.2rem; }
		.post-card-body { padding: 1rem 1.2rem; }
		.post-card-body h2 { font-size: 20px; }
	}
</style>