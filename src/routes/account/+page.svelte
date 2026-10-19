<script lang="ts">
	import { invalidateAll, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { authClient } from '$lib/auth-client';
	import {
		validateEmail,
		validatePassword,
		validatePasswordConfirm,
		validateName,
		validatePhone,
		validateAddress,
		validateCity,
		hasErrors,
		type FieldError
	} from '$lib/validation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let profile = $derived(data.profile);
	let cart = $derived(data.cart);
	let history = $derived(data.history);

	type Errors = Record<string, FieldError>;

	// ── Panier & historique ────────────────────────────────────
	const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
	const dateFmt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' });
	const fmtDate = (d: string | null) => (d ? dateFmt.format(new Date(d)) : '—');

	const STATUS_LABEL: Record<string, string> = {
		completed: 'Validée',
		cancelled: 'Annulée',
		pending: 'En cours'
	};

	let cartMsg = $state<string | null>(null);
	// Rafraîchit panier + historique après chaque action, et affiche un retour.
	const cartAction = (onSuccess?: string) => () =>
		async ({ result, update }: any) => {
			await update({ reset: false });
			if (result.type === 'success') cartMsg = onSuccess ?? null;
			else cartMsg = null;
		};

	// ── Déconnecté : connexion / inscription ───────────────────
	let tab = $state<'login' | 'register'>('login');
	let busy = $state(false);
	let authError = $state<string | null>(null);

	let login = $state({ email: '', password: '' });
	let loginErr = $state<Errors>({});

	async function submitLogin(e: SubmitEvent) {
		e.preventDefault();
		authError = null;
		loginErr = { email: validateEmail(login.email), password: validatePassword(login.password) };
		if (hasErrors(loginErr)) return;
		busy = true;
		const res = await authClient.signIn.email({ email: login.email.trim(), password: login.password });
		busy = false;
		if (res.error) authError = res.error.message ?? 'Identifiants invalides';
		else await invalidateAll();
	}

	let reg = $state({ email: '', name: '', phone: '', address: '', city: '', password: '', confirm: '' });
	let regErr = $state<Errors>({});

	async function submitRegister(e: SubmitEvent) {
		e.preventDefault();
		authError = null;
		regErr = {
			email: validateEmail(reg.email),
			name: validateName(reg.name, { required: true }),
			phone: validatePhone(reg.phone, { required: true }),
			address: validateAddress(reg.address, { required: false }),
			city: validateCity(reg.city, { required: false }),
			password: validatePassword(reg.password, { isNew: true }),
			confirm: validatePasswordConfirm(reg.password, reg.confirm)
		};
		if (hasErrors(regErr)) return;
		busy = true;
		const res = await authClient.signUp.email({
			email: reg.email.trim(),
			password: reg.password,
			name: reg.name.trim(),
			phone: reg.phone.trim(),
			fname: reg.name.trim(),
			address: reg.address.trim(),
			city: reg.city.trim()
		} as any);
		busy = false;
		if (res.error) authError = res.error.message ?? "Échec de l'inscription";
		else await invalidateAll();
	}

	// ── Connecté : édition du profil (PATCH /api/account) ──────
	let edit = $state({ name: '', fname: '', phone: '', address: '', city: '' });
	let editErr = $state<Errors>({});
	let editMsg = $state<string | null>(null);
	let editFail = $state<string | null>(null);

	// Hydrate le formulaire d'édition dès que le profil est connu.
	$effect(() => {
		if (profile) {
			edit = {
				name: profile.name ?? '',
				fname: profile.fname ?? '',
				phone: profile.phone ?? '',
				address: profile.address ?? '',
				city: profile.city ?? ''
			};
		}
	});

	async function submitEdit(e: SubmitEvent) {
		e.preventDefault();
		editMsg = editFail = null;
		editErr = {
			name: validateName(edit.name, { required: true }),
			fname: validateName(edit.fname, { required: false }),
			phone: validatePhone(edit.phone, { required: true }),
			address: validateAddress(edit.address, { required: false }),
			city: validateCity(edit.city, { required: false })
		};
		if (hasErrors(editErr)) return;
		busy = true;
		const res = await fetch('/api/account', {
			method: 'PATCH',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(edit)
		});
		busy = false;
		if (res.status === 422) {
			editErr = (await res.json()).errors ?? {};
			return;
		}
		if (!res.ok) {
			editFail = (await res.json().catch(() => ({}))).message ?? 'Mise à jour impossible';
			return;
		}
		editMsg = 'Profil mis à jour.';
		await invalidateAll();
	}

	async function logout() {
		busy = true;
		await authClient.signOut();
		busy = false;
		await invalidateAll();
	}

	// ── Zone dangereuse : suppression du compte ────────────────
	let confirmingDelete = $state(false);
	let deletePassword = $state('');
	let deleteErr = $state<string | null>(null);

	async function deleteAccount(e: SubmitEvent) {
		e.preventDefault();
		deleteErr = null;
		if (!deletePassword) {
			deleteErr = 'Mot de passe requis';
			return;
		}
		busy = true;
		const res = await fetch('/api/account', {
			method: 'DELETE',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ password: deletePassword })
		});
		busy = false;
		if (!res.ok) {
			deleteErr = (await res.json().catch(() => ({}))).message ?? 'Suppression impossible';
			return;
		}
		await goto('/');
	}
</script>

<svelte:head><title>Mon compte | Symios</title></svelte:head>

<section class="account">
	{#if profile}
		<!-- ─────────── CONNECTÉ ─────────── -->
		<header class="acc-head">
			<div>
				<p class="section-index">// MON COMPTE</p>
				<h1>Bonjour {profile.fname || profile.name}</h1>
				<p class="mono sub">{profile.email}</p>
			</div>
			<button class="cta-light" onclick={logout} disabled={busy}>Déconnexion</button>
		</header>

		<!-- ─────────── PANIER EN COURS ─────────── -->
		<section id="panier" class="panel card cart">
			<div class="cart-head">
				<h2>Mon panier</h2>
				{#if cart && cart.items.length}
					<span class="mono sub">{cart.items.length} ligne{cart.items.length > 1 ? 's' : ''}</span>
				{/if}
			</div>

			{#if cartMsg}<div class="alert alert-success">{cartMsg}</div>{/if}

			{#if cart && cart.items.length}
				<ul class="lines">
					{#each cart.items as item (item.id)}
						<li class="line">
							<div class="line-info">
								<span class="line-title">{item.title ?? 'Article'}</span>
								<span class="mono sub">
									{item.quantity} × {euro.format(item.price ?? 0)}
									{#if item.slices > 1}· {item.slices} parts{/if}
								</span>
							</div>
							<span class="line-total">{euro.format(item.unit_price)}</span>
							<form method="POST" action="?/removeItem" use:enhance={cartAction()}>
								<input type="hidden" name="itemId" value={item.id} />
								<button type="submit" class="line-remove" aria-label="Retirer une unité">−</button>
							</form>
						</li>
					{/each}
				</ul>

				<div class="cart-foot">
					<span class="cart-total">Total <strong>{euro.format(cart.total)}</strong></span>
					<div class="cart-actions">
						<form method="POST" action="?/clearCart" use:enhance={cartAction('Panier vidé.')}>
							<button type="submit" class="cta-light">Vider</button>
						</form>
						<a href="{resolve('/shop/checkout')}" class="cta">Passer au paiement →</a>
					</div>
				</div>
			{:else}
				<p class="mono sub empty-cart">
					Votre panier est vide. <a href="{resolve('/shop')}">Parcourir la boutique →</a>
				</p>
			{/if}
		</section>

		<!-- ─────────── HISTORIQUE ─────────── -->
		<section class="panel card history">
			<h2>Historique des commandes</h2>
			{#if history.length}
				<ul class="orders">
					{#each history as order (order.id)}
						<li class="order">
							<div class="order-head">
								<span class="mono sub">{fmtDate(order.created_at)}</span>
								<span class="badge badge-{order.status}">{STATUS_LABEL[order.status] ?? order.status}</span>
								<span class="order-total">{euro.format(order.total_amount || order.total)}</span>
							</div>
							{#if order.items.length}
								<ul class="order-items mono sub">
									{#each order.items as item (item.id)}
										<li>{item.quantity} × {item.title ?? 'Article'} — {euro.format(item.unit_price)}</li>
									{/each}
								</ul>
							{/if}
						</li>
					{/each}
				</ul>
			{:else}
				<p class="mono sub">Aucune commande pour le moment.</p>
			{/if}
		</section>

		<div class="acc-grid">
			<form class="panel card" onsubmit={submitEdit}>
				<h2>Mes informations</h2>

				{#if editMsg}<div class="alert alert-success">{editMsg}</div>{/if}
				{#if editFail}<div class="alert alert-error">{editFail}</div>{/if}

				<div class="form-grid">
					<div class="full">
						<label class="label" for="e-name">Nom</label>
						<input id="e-name" class="input" bind:value={edit.name} aria-invalid={!!editErr.name} />
						{#if editErr.name}<p class="field-error">{editErr.name}</p>{/if}
					</div>
					<div>
						<label class="label" for="e-fname">Prénom</label>
						<input id="e-fname" class="input" bind:value={edit.fname} aria-invalid={!!editErr.fname} />
						{#if editErr.fname}<p class="field-error">{editErr.fname}</p>{/if}
					</div>
					<div>
						<label class="label" for="e-phone">Téléphone</label>
						<input id="e-phone" class="input" bind:value={edit.phone} aria-invalid={!!editErr.phone} />
						{#if editErr.phone}<p class="field-error">{editErr.phone}</p>{/if}
					</div>
					<div>
						<label class="label" for="e-address">Adresse</label>
						<input id="e-address" class="input" bind:value={edit.address} aria-invalid={!!editErr.address} />
						{#if editErr.address}<p class="field-error">{editErr.address}</p>{/if}
					</div>
					<div>
						<label class="label" for="e-city">Ville</label>
						<input id="e-city" class="input" bind:value={edit.city} aria-invalid={!!editErr.city} />
						{#if editErr.city}<p class="field-error">{editErr.city}</p>{/if}
					</div>
				</div>

				<button type="submit" class="cta" disabled={busy}>Enregistrer</button>
			</form>

			<aside class="panel card danger">
				<h2>Zone sensible</h2>
				<p class="mono sub">La suppression est définitive et efface toutes vos données.</p>
				{#if !confirmingDelete}
					<button class="cta-light danger-btn cta-some" onclick={() => (confirmingDelete = true)}>
						Supprimer mon compte
					</button>
				{:else}
					<form class="confirm" onsubmit={deleteAccount}>
						<div>
							<label class="label" for="d-pass">Confirmez avec votre mot de passe</label>
							<input
								id="d-pass"
								class="input"
								type="password"
								bind:value={deletePassword}
								aria-invalid={!!deleteErr} />
							{#if deleteErr}<p class="field-error">{deleteErr}</p>{/if}
						</div>
						<div class="confirm-actions">
							<button type="button" class="cta-light" onclick={() => (confirmingDelete = false)}>
								Annuler
							</button>
							<button type="submit" class="cta danger-cta" disabled={busy}>Supprimer définitivement</button>
						</div>
					</form>
				{/if}
			</aside>

			<a href={resolve('/account/data')} class="panel card rgpd-link mono-alt">
				Mes données (RGPD) →
				<span class="sub">Accès, portabilité, suppression de vos données personnelles.</span>
			</a>
		</div>
	{:else}
		<!-- ─────────── DÉCONNECTÉ ─────────── -->
		<header class="acc-head">
			<div>
				<p class="section-index">// ESPACE CLIENT</p>
				<h1>{tab === 'login' ? 'Connexion' : 'Inscription'}</h1>
			</div>
		</header>

		<div class="auth-card panel card">
			<div class="tabs">
				<button class="chip" aria-pressed={tab === 'login'} onclick={() => (tab = 'login')}>
					Connexion
				</button>
				<button class="chip" aria-pressed={tab === 'register'} onclick={() => (tab = 'register')}>
					Créer un compte
				</button>
			</div>

			{#if authError}<div class="alert alert-error">{authError}</div>{/if}

			{#if tab === 'login'}
				<form class="form-grid" onsubmit={submitLogin}>
					<div class="full">
						<label class="label" for="l-email">Email</label>
						<input id="l-email" class="input" type="email" bind:value={login.email} aria-invalid={!!loginErr.email} />
						{#if loginErr.email}<p class="field-error">{loginErr.email}</p>{/if}
					</div>
					<div class="full">
						<label class="label" for="l-pass">Mot de passe</label>
						<input id="l-pass" class="input" type="password" bind:value={login.password} aria-invalid={!!loginErr.password} />
						{#if loginErr.password}<p class="field-error">{loginErr.password}</p>{/if}
					</div>
					<div class="forgot-row">
						<button type="submit" class="cta" disabled={busy}>Se connecter</button>
						<a href={resolve('/forgot-password')} class="forgot-link mono-alt">Mot de passe oublié ?</a>
					</div>
				</form>
			{:else}
				<form class="form-grid" onsubmit={submitRegister}>
					<div class="full">
						<label class="label" for="r-name">Nom complet</label>
						<input id="r-name" class="input" bind:value={reg.name} aria-invalid={!!regErr.name} />
						{#if regErr.name}<p class="field-error">{regErr.name}</p>{/if}
					</div>
					<div class="full">
						<label class="label" for="r-email">Email</label>
						<input id="r-email" class="input" type="email" bind:value={reg.email} aria-invalid={!!regErr.email} />
						{#if regErr.email}<p class="field-error">{regErr.email}</p>{/if}
					</div>
					<div>
						<label class="label" for="r-phone">Téléphone</label>
						<input id="r-phone" class="input" bind:value={reg.phone} aria-invalid={!!regErr.phone} />
						{#if regErr.phone}<p class="field-error">{regErr.phone}</p>{/if}
					</div>
					<div>
						<label class="label" for="r-city">Ville</label>
						<input id="r-city" class="input" bind:value={reg.city} aria-invalid={!!regErr.city} />
						{#if regErr.city}<p class="field-error">{regErr.city}</p>{/if}
					</div>
					<div class="full">
						<label class="label" for="r-address">Adresse</label>
						<input id="r-address" class="input" bind:value={reg.address} aria-invalid={!!regErr.address} />
						{#if regErr.address}<p class="field-error">{regErr.address}</p>{/if}
					</div>
					<div>
						<label class="label" for="r-pass">Mot de passe</label>
						<input id="r-pass" class="input" type="password" bind:value={reg.password} aria-invalid={!!regErr.password} />
						{#if regErr.password}<p class="field-error">{regErr.password}</p>{/if}
					</div>
					<div>
						<label class="label" for="r-confirm">Confirmation</label>
						<input id="r-confirm" class="input" type="password" bind:value={reg.confirm} aria-invalid={!!regErr.confirm} />
						{#if regErr.confirm}<p class="field-error">{regErr.confirm}</p>{/if}
					</div>
					<button type="submit" class="cta full" disabled={busy}>Créer mon compte</button>
				</form>
			{/if}
		</div>
	{/if}
</section>

<style>
	.cta-some:hover{
		transform: translateY(-2px);
		background: var(--primary);
		color: var(--accent-color);
		border-color: var(--accent);
	}
	.account {
		max-width: 1100px;
		margin-inline: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.6rem;
	}
	.acc-head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.acc-head h1 {
		margin-top: 0.4rem;
	}
	.sub {
		font-size: 13px;
		color: var(--text-muted);
		margin-top: 0.3rem;
	}

	.card {
		padding: 1.6rem;
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}
	.card h2 {
		font-family: 'Monoton', sans-serif;
		font-size: 22px;
		color: var(--primary);
	}

	.acc-grid {
		display: grid;
		grid-template-columns: 1.6fr 1fr;
		gap: 24px;
		align-items: start;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	.form-grid .full {
		grid-column: 1 / -1;
	}
	.form-grid .cta {
		cursor: pointer;
		justify-self: start;
	}
	.form-grid .cta.full {
		justify-self: stretch;
	}

	.auth-card {
		max-width: 560px;
		margin-inline: auto;
		width: 100%;
	}
	.forgot-row {
		grid-column: 1 / -1;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}
	.forgot-link {
		font-size: 11px;
		letter-spacing: 0.1em;
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
	}
	.tabs {
		display: flex;
		gap: 11px;
	}
	.tabs .chip {
		flex: 1;
		text-align: center;
	}

	.danger h2 {
		color: var(--accent);
	}
	.danger-btn {
		border-color: var(--accent);
		color: var(--accent);
		cursor: pointer;
	}
	.confirm {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.confirm-actions {
		display: flex;
		gap: 0.8rem;
		flex-wrap: wrap;
	}
	.confirm-actions .cta-light,
	.confirm-actions .cta {
		cursor: pointer;
	}
	.danger-cta {
		background-color: var(--accent);
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* ── Panier ─────────────────────────────────────────── */
	.cart-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}
	.lines {
		list-style: none;
		display: flex;
		flex-direction: column;
	}
	.line {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.9rem 0;
		border-top: 1px dashed #c9b894;
	}
	.line:first-child {
		border-top: none;
	}
	.line-info {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		flex: 1;
		min-width: 0;
	}
	.line-title {
		font-weight: 600;
		color: var(--primary);
	}
	.line-total {
		font-family: 'Monoton', sans-serif;
		font-weight: 700;
		color: var(--primary);
		white-space: nowrap;
	}
	.line-remove {
		width: 34px;
		height: 34px;
		flex-shrink: 0;
		border: var(--line, 1px) solid var(--accent);
		background: transparent;
		color: var(--accent);
		border-radius: 50%;
		font-size: 18px;
		line-height: 1;
		cursor: pointer;
	}
	.cart-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		padding-top: 1rem;
		border-top: 2px solid var(--primary);
	}
	.cart-total {
		font-size: 15px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-muted);
	}
	.cart-total strong {
		font-family: 'Monoton', sans-serif;
		font-size: 24px;
		color: var(--primary);
		margin-left: 0.5rem;
	}
	.cart-actions {
		display: flex;
		gap: 0.8rem;
		flex-wrap: wrap;
	}
	.cart-actions .cta,
	.cart-actions .cta-light {
		cursor: pointer;
	}
	.empty-cart a {
		color: var(--accent);
	}

	/* ── Historique ─────────────────────────────────────── */
	.orders {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.order {
		border: 1px solid #c9b894;
		border-radius: var(--radius, 8px);
		padding: 1rem 1.1rem;
	}
	.order-head {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		flex-wrap: wrap;
	}
	.order-total {
		margin-left: auto;
		font-family: 'Monoton', sans-serif;
		font-weight: 700;
		color: var(--primary);
	}
	.badge {
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 3px 9px;
		border-radius: 999px;
		color: var(--text-ondark);
		background: var(--text-muted);
	}
	.badge-completed {
		background: var(--olive, #6b7d3a);
	}
	.badge-cancelled {
		background: var(--accent);
	}
	.order-items {
		margin-top: 0.7rem;
		padding-left: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	/* ── RGPD ──────────────────────────────────────────── */
	.rgpd-link {
		text-decoration: none;
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--accent);
		border: var(--line) solid var(--accent);
		transition: transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
	}
	.rgpd-link .sub {
		font-size: 12px;
		font-weight: 400;
		letter-spacing: 0;
		text-transform: none;
		color: var(--text-muted);
		margin-top: 0.2rem;
	}
	.rgpd-link:hover {
		transform: translate(-2px, -2px);
		box-shadow: 4px 4px 0 0 var(--accent);
		background: var(--background-accent);
	}

	@media (max-width: 760px) {
		.account {
			padding: 1.2rem;
		}
		.acc-grid,
		.form-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
