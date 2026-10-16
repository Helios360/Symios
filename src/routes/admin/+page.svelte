<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
	const fmtDate = (d: string | number | Date) => new Date(d).toLocaleDateString('fr-FR', { dateStyle: 'short' });

	/* ── Tabs ── */
	let tab = $state<'users' | 'products' | 'carts' | 'blog'>('users');

	/* ── Article edit state ── */
	let editingArticle = $state<number | null>(null); // null = create new
	let art = $state({ slug: '', title: '', subtitle: '', price: 0, categoryId: 0, detailsHtml: '' });

	function openNewArticle() {
		editingArticle = null;
		art = { slug: '', title: '', subtitle: '', price: 0, categoryId: data.categories[0]?.id ?? 0, detailsHtml: '' };
	}

	function openEditArticle(a: any) {
		editingArticle = a.id;
		art = {
			slug: a.slug,
			title: a.title,
			subtitle: a.subtitle ?? '',
			price: Number(a.price),
			categoryId: a.category_id,
			detailsHtml: a.details_html ?? ''
		};
	}

	function closeEdit() { editingArticle = null; }

	const roleOptions = [
		{ value: 0, label: 'Utilisateur' },
		{ value: 1, label: 'Admin' }
	];

	/* ── Category edit ── */
	let newCatName = $state('');

	/* ── Blog post edit state ── */
	let editingBlogPost = $state<string | null | undefined>(undefined); // undefined = closed, null = new, string = edit id
	let blog = $state({ slug: '', title: '', excerpt: '', content: '', published: false });

	function openNewBlogPost() {
		editingBlogPost = null;
		blog = { slug: '', title: '', excerpt: '', content: '', published: false };
	}

	function openEditBlogPost(bp: any) {
		editingBlogPost = bp.id;
		blog = {
			slug: bp.slug,
			title: bp.title,
			excerpt: bp.excerpt ?? '',
			content: bp.content ?? '',
			published: !!bp.published
		};
	}

	function closeBlogEdit() { editingBlogPost = undefined; }

	/* ── Toast ── */
	let msg = $state<string | null>(null);
	let msgType = $state<'success' | 'error'>('success');
	let msgTimer: ReturnType<typeof setTimeout>;
	function flash(m: string, type: 'success' | 'error' = 'success') {
		msg = m;
		msgType = type;
		clearTimeout(msgTimer);
		msgTimer = setTimeout(() => msg = null, 3000);
	}

	/* ── Enhanced form callbacks ── */
	const onResult = ({ form, formData }: any) => {
		return async ({ result, update }: any) => {
			await update();
			if (result.type === 'success') flash('✔ Action effectuée', 'success');
			else flash('✖ Erreur — voir les logs', 'error');
		};
	};
</script>

<svelte:head><title>Admin | Symios</title></svelte:head>

<section class="admin-page">
	<header class="admin-head">
		<h1>Panneau d'administration</h1>
	</header>

	{#if msg}
		<div class="alert alert-{msgType}">{msg}</div>
	{/if}

	<!-- TABS -->
	<div class="tabs">
		<button class="chip" aria-pressed={tab === 'users'} onclick={() => (tab = 'users')}>
			Utilisateurs · {data.users.length}
		</button>
		<button class="chip" aria-pressed={tab === 'products'} onclick={() => (tab = 'products')}>
			Produits · {data.articles.length}
		</button>
		<button class="chip" aria-pressed={tab === 'carts'} onclick={() => (tab = 'carts')}>
			Paniers · {data.carts.length}
		</button>
		<button class="chip" aria-pressed={tab === 'blog'} onclick={() => (tab = 'blog')}>
			Blog · {data.blogPosts.length}
		</button>
	</div>

	<!-- ──────────────────── USERS TAB ──────────────────── -->
	{#if tab === 'users'}
		<div class="panel card">
			<h2>Tous les utilisateurs</h2>
			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th>Nom</th>
							<th>Email</th>
							<th>Rôle</th>
							<th>Inscrit</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each data.users as u}
							<tr>
								<td class="mono">{u.name}</td>
								<td class="mono">{u.email}</td>
								<td>
									<form method="POST" action="?/setRole" use:enhance={onResult}>
										<input type="hidden" name="userId" value={u.id} />
										<select name="role" class="role-select" onchange={(e) => (e.currentTarget.form as HTMLFormElement).requestSubmit()}>
											{#each roleOptions as opt}
												<option value={opt.value} selected={u.role === opt.value}>{opt.label}</option>
											{/each}
										</select>
									</form>
								</td>
								<td class="mono sub">{fmtDate(u.createdAt)}</td>
								<td>
									<form method="POST" action="?/deleteUser" use:enhance={onResult} onsubmit={(e) => { if (!confirm(`Supprimer ${u.name} définitivement ?`)) e.preventDefault(); }}>
										<input type="hidden" name="userId" value={u.id} />
										<button type="submit" class="btn-sm danger">supprimer</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

	<!-- ──────────────────── PRODUCTS TAB ──────────────────── -->
	{:else if tab === 'products'}
		<div class="panel card">
			<div class="prod-head">
				<h2>Articles</h2>
				<button class="cta" onclick={openNewArticle}>+ Nouvel article</button>
			</div>

			{#if editingArticle !== undefined}
				{@const isNew = editingArticle === null}
				<div class="edit-overlay">
					<form method="POST" action={isNew ? '?/createArticle' : '?/editArticle'} use:enhance={onResult}>
						<input type="hidden" name="id" value={editingArticle ?? ''} />

						<div class="form-grid">
							<div>
								<label class="label" for="art-slug">Slug</label>
								<input id="art-slug" class="input" name="slug" bind:value={art.slug} required />
							</div>
							<div>
								<label class="label" for="art-title">Titre</label>
								<input id="art-title" class="input" name="title" bind:value={art.title} required />
							</div>
							<div class="full">
								<label class="label" for="art-sub">Sous-titre</label>
								<input id="art-sub" class="input" name="subtitle" bind:value={art.subtitle} />
							</div>
							<div>
								<label class="label" for="art-price">Prix (€)</label>
								<input id="art-price" class="input" type="number" step="0.01" name="price" bind:value={art.price} required />
							</div>
							<div>
								<label class="label" for="art-cat">Catégorie</label>
								<select id="art-cat" class="input" name="categoryId" bind:value={art.categoryId}>
									{#each data.categories as cat}
										<option value={cat.id}>{cat.name}</option>
									{/each}
								</select>
							</div>
							<div class="full">
								<label class="label" for="art-html">HTML des détails (&lt;ul&gt;&lt;li&gt;…)</label>
								<textarea id="art-html" class="input area" name="detailsHtml" bind:value={art.detailsHtml} rows="4"></textarea>
							</div>
						</div>

						<div class="edit-actions">
							<button type="submit" class="cta">{isNew ? 'Créer' : 'Enregistrer'}</button>
							<button type="button" class="cta-light" onclick={closeEdit}>Annuler</button>
						</div>
					</form>
				</div>
			{/if}

			<div class="table-wrap">
				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>Slug</th>
							<th>Titre</th>
							<th>Catégorie</th>
							<th>Prix</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each data.articles as a}
							<tr>
								<td>{a.id}</td>
								<td class="mono">{a.slug}</td>
								<td>{a.title}</td>
								<td class="mono">{a.category_name ?? '—'}</td>
								<td>{euro.format(a.price)}</td>
								<td class="actions-cell">
									<button class="btn-sm" onclick={() => openEditArticle(a)}>modifier</button>
									<form method="POST" action="?/deleteArticle" use:enhance={onResult} onsubmit={(e) => { if (!confirm(`Supprimer « ${a.title} » ?`)) e.preventDefault(); }}>
										<input type="hidden" name="id" value={a.id} />
										<button type="submit" class="btn-sm danger">supprimer</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- ── Catégories ── -->
		<div class="panel card">
			<h2>Catégories</h2>
			<div class="cat-list">
				{#each data.categories as cat}
					<div class="cat-row">
						<span class="mono">{cat.name}</span>
						<form method="POST" action="?/deleteCategory" use:enhance={onResult} onsubmit={(e) => { if (!confirm(`Supprimer la catégorie « ${cat.name} » ?`)) e.preventDefault(); }}>
							<input type="hidden" name="id" value={cat.id} />
							<button type="submit" class="btn-sm danger">supprimer</button>
						</form>
					</div>
				{/each}
			</div>
			<form method="POST" action="?/createCategory" use:enhance={onResult} class="cat-add">
				<input class="input" name="name" placeholder="Nouvelle catégorie…" bind:value={newCatName} required />
				<button type="submit" class="cta">Ajouter</button>
			</form>
		</div>

	<!-- ──────────────────── CARTS TAB ──────────────────── -->
	{:else if tab === 'carts'}
		<div class="panel card">
			<h2>Tous les paniers</h2>
			{#if data.carts.length}
				<div class="table-wrap">
					<table>
						<thead>
							<tr>
								<th>Client</th>
								<th>Email</th>
								<th>Total</th>
								<th>Statut</th>
								<th>Créé</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each data.carts as c}
								<tr>
									<td class="mono">{c.user_name ?? '—'}</td>
									<td class="mono sub">{c.user_email ?? '—'}</td>
									<td>{euro.format(c.total_amount)}</td>
									<td>
										<span class="badge badge-{c.status}">{c.status}</span>
									</td>
									<td class="sub">{fmtDate(c.created_at)}</td>
									<td class="actions-cell">
												{#if c.status === 'pending'}
													<form method="POST" action="?/completeCart" use:enhance={onResult} style="display:inline">
														<input type="hidden" name="cartId" value={c.id} />
														<button type="submit" class="btn-sm">valider</button>
													</form>
													<form method="POST" action="?/cancelCart" use:enhance={onResult} style="display:inline" onsubmit={(e) => { if (!confirm('Annuler ce panier ?')) e.preventDefault(); }}>
														<input type="hidden" name="cartId" value={c.id} />
														<button type="submit" class="btn-sm danger">annuler</button>
													</form>
												{:else}
													<span class="mono sub">—</span>
												{/if}
											</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<p class="mono sub">Aucun panier pour le moment.</p>
			{/if}
		</div>
	{:else if tab === 'blog'}
		<div class="panel card">
			<div class="prod-head">
				<h2>Articles de blog</h2>
				<button class="cta" onclick={openNewBlogPost}>+ Nouvel article</button>
			</div>

			{#if editingBlogPost !== undefined}
				{@const isNew = editingBlogPost === null}
				<div class="edit-overlay">
					<form method="POST" action={isNew ? '?/createBlogPost' : '?/editBlogPost'} use:enhance={onResult}>
						<input type="hidden" name="id" value={editingBlogPost ?? ''} />

						<div class="form-grid">
							<div>
								<label class="label" for="blog-slug">Slug</label>
								<input id="blog-slug" class="input" name="slug" bind:value={blog.slug} required />
							</div>
							<div>
								<label class="label" for="blog-title">Titre</label>
								<input id="blog-title" class="input" name="title" bind:value={blog.title} required />
							</div>
							<div class="full">
								<label class="label" for="blog-excerpt">Extrait</label>
								<input id="blog-excerpt" class="input" name="excerpt" bind:value={blog.excerpt} maxlength="500" />
							</div>
							<div class="full">
								<label class="label" for="blog-content">Contenu (Markdown / HTML)</label>
								<textarea id="blog-content" class="input area" name="content" bind:value={blog.content} rows="12"></textarea>
							</div>
							<div>
								<label class="label">
									<input type="checkbox" name="published" bind:checked={blog.published} />
									Publié
								</label>
							</div>
						</div>

						<div class="edit-actions">
							<button type="submit" class="cta">{isNew ? 'Créer' : 'Enregistrer'}</button>
							<button type="button" class="cta-light" onclick={closeBlogEdit}>Annuler</button>
						</div>
					</form>
				</div>
			{/if}

			{#if data.blogPosts.length}
				<div class="table-wrap">
					<table>
						<thead>
							<tr>
								<th>Titre</th>
								<th>Slug</th>
								<th>Publié</th>
								<th>Auteur</th>
								<th>Date</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each data.blogPosts as bp}
								<tr>
									<td>{bp.title}</td>
									<td class="mono">{bp.slug}</td>
									<td>
										<span class="badge badge-{bp.published ? 'completed' : 'pending'}">{bp.published ? 'oui' : 'brouillon'}</span>
									</td>
									<td class="mono sub">{bp.author_name ?? '—'}</td>
									<td class="sub">{bp.published_at ? fmtDate(bp.published_at) : fmtDate(bp.created_at)}</td>
									<td class="actions-cell">
										<button class="btn-sm" onclick={() => openEditBlogPost(bp)}>modifier</button>
										<form method="POST" action="?/deleteBlogPost" use:enhance={onResult} onsubmit={(e) => { if (!confirm(`Supprimer « ${bp.title} » ?`)) e.preventDefault(); }}>
											<input type="hidden" name="id" value={bp.id} />
											<button type="submit" class="btn-sm danger">supprimer</button>
										</form>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<p class="mono sub">Aucun article de blog pour le moment.</p>
			{/if}
		</div>
	{/if}
</section>

<style>
	.admin-page {
		max-width: 1100px;
		margin-inline: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.4rem;
	}

	.admin-head h1 { margin-top: 0.4rem; display: flex; flex-direction:column;}

	.tabs {
		display: flex;
		gap: 11px;
		flex-wrap: wrap;
	}
	.tabs .chip { flex: 0; }

	.card {
		padding: 1.4rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.card h2 {
		font-family: 'Monoton', sans-serif;
		font-size: 22px;
		color: var(--primary);
	}

	/* ── Table ── */
	.table-wrap {
		overflow-x: auto;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
	}
	thead th {
		text-align: left;
		padding: 10px 12px;
		font-family: 'details', monospace;
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-muted);
		border-bottom: 2px solid var(--primary);
	}
	tbody td {
		padding: 10px 12px;
		border-bottom: 1px solid #e0d4be;
		vertical-align: middle;
	}
	tbody tr:hover { background: rgba(181, 67, 28, 0.04); }
	.actions-cell { display: flex; gap: 8px; align-items: center; }

	/* ── Buttons ── */
	.btn-sm {
		border: 2px solid var(--primary);
		border-radius: var(--smaller-radius);
		padding: 6px 12px;
		font-family: 'details', monospace;
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
		background: var(--surface);
		color: var(--primary);
		transition: background 0.15s, color 0.15s;
	}
	.btn-sm:hover { background: var(--primary); color: var(--text-ondark); }
	.btn-sm.danger { border-color: var(--accent); color: var(--accent); }
	.btn-sm.danger:hover { background: var(--accent); color: var(--accent-color); }

	.role-select {
		border: 2px solid var(--primary);
		border-radius: var(--smaller-radius);
		padding: 4px 8px;
		font-family: 'details', monospace;
		font-size: 11px;
		background: var(--surface);
		color: var(--primary);
		cursor: pointer;
	}

	/* ── Badge ── */
	.badge {
		display: inline-block;
		padding: 3px 10px;
		border-radius: 999px;
		font-family: 'details', monospace;
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.badge-pending { background: rgba(224, 152, 47, 0.18); color: #8a5f12; }
	.badge-completed { background: rgba(111, 133, 74, 0.18); color: #4d6330; }
	.badge-cancelled { background: rgba(181, 67, 28, 0.12); color: var(--accent); }

	/* ── Edit overlay ── */
	.edit-overlay {
		background: var(--surface);
		border: 2px solid var(--primary);
		border-radius: var(--bigger-radius);
		padding: 1.2rem;
	}
	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	.form-grid .full { grid-column: 1 / -1; }
	.input.area { resize: vertical; font-size: 13px; }
	.edit-actions {
		margin-top: 1rem;
		display: flex;
		gap: 1rem;
	}

	/* ── Prod head ── */
	.prod-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	/* ── Categories ── */
	.cat-list {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.cat-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 10px;
		background: var(--background-accent);
		border-radius: var(--smaller-radius);
	}
	.cat-add {
		display: flex;
		gap: 10px;
		margin-top: 0.3rem;
	}
	.cat-add .input { flex: 1; }

	@media (max-width: 640px) {
		.admin-page { padding: 1.2rem; }
		.form-grid { grid-template-columns: 1fr; }
		.cat-add { flex-direction: column; }
	}
</style>