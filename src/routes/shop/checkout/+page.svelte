<script lang="ts">
	import { base } from '$app/paths';
	import { reveal } from '$lib/motion/reveal';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let cart = $derived(data.cart);
	let lineItems = $derived(data.lineItems);

	const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

	let deliveryDate = $state(cart.delivery_date ?? '');
	let customerMessage = $state(cart.customer_message ?? '');
	let saving = $state(false);

	async function saveDeliveryInfo() {
		saving = true;
		await fetch('/symios/shop/checkout?/setDelivery', {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				deliveryDate,
				customerMessage
			})
		});
		saving = false;
	}
</script>

<svelte:head><title>Paiement | Symios</title></svelte:head>

<section class="checkout" use:reveal>
	<p class="section-index">// PAIEMENT</p>
	<h1>Finaliser la commande</h1>

	<div class="checkout-grid">
		<!-- ─── Récapitulatif du panier ─── -->
		<section class="panel card recap">
			<h2>Récapitulatif</h2>
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
					</li>
				{/each}
			</ul>
			<div class="cart-foot">
				<span class="cart-total">Total <strong>{euro.format(cart.total)}</strong></span>
				<a href="{base}/account#panier" class="cta-light">Modifier le panier</a>
			</div>
		</section>

		<!-- ─── Infos livraison ─── -->
		<section class="panel card delivery">
			<h2>Livraison</h2>
			<p class="mono sub">Optionnel — précisez une date de livraison souhaitée ou un message.</p>

			<div class="field">
				<label class="label" for="deliveryDate">Date de livraison souhaitée</label>
				<input
					id="deliveryDate"
					class="input"
					type="date"
					bind:value={deliveryDate}
					onchange={saveDeliveryInfo}
				/>
			</div>
			<div class="field">
				<label class="label" for="customerMessage">Message / instructions</label>
				<textarea
					id="customerMessage"
					class="input"
					rows="3"
					bind:value={customerMessage}
					onchange={saveDeliveryInfo}
					placeholder="Un détail à préciser…"
				></textarea>
			</div>
			{#if saving}<span class="mono sub">Enregistrement…</span>{/if}
		</section>

		<!-- ─── Paiement Stripe ─── -->
		<section class="panel card payment">
			<h2>Paiement sécurisé</h2>
			<p class="mono sub">
				Vous allez être redirigé vers Stripe pour payer par carte bancaire
				(CB, Visa, Mastercard). Aucune donnée bancaire ne transite par nos serveurs.
			</p>

			<form method="POST" action="?/checkout">
				<input type="hidden" name="deliveryDate" value={deliveryDate} />
				<input type="hidden" name="customerMessage" value={customerMessage} />
				<button type="submit" class="cta stripe-btn">
					Payer {euro.format(cart.total)}
					<span class="stripe-lock">🔒</span>
				</button>
			</form>
		</section>
	</div>
</section>

<style>
	.checkout {
		max-width: 860px;
		margin-inline: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.6rem;
	}
	.checkout h1 {
		margin-top: 0.4rem;
	}
	.checkout-grid {
		display: flex;
		flex-direction: column;
		gap: 1.4rem;
	}
	.panel {
		padding: 1.6rem;
		display: flex;
		flex-direction: column;
		gap: 1.1rem;
	}
	.panel h2 {
		font-family: 'artistic', serif;
		font-size: 22px;
		color: var(--primary);
	}

	/* ── Lines ── */
	.lines {
		list-style: none;
		display: flex;
		flex-direction: column;
	}
	.line {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.7rem 0;
		border-bottom: 1px solid var(--line);
	}
	.line:last-child { border-bottom: none; }
	.line-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.line-title {
		font-weight: 600;
		font-size: 15px;
	}
	.line-total {
		font-family: 'details', monospace;
		font-size: 15px;
		font-weight: 700;
		color: var(--primary);
		white-space: nowrap;
	}
	.cart-foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		padding-top: 0.5rem;
	}
	.cart-total {
		font-size: 18px;
	}
	.cart-total strong {
		font-family: 'artistic', serif;
		font-size: 24px;
		color: var(--primary);
	}

	/* ── Fields ── */
	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}
	.field textarea {
		resize: vertical;
		font-family: inherit;
	}
	.input {
		padding: 0.6rem 0.9rem;
		border: 1px solid var(--line);
		border-radius: var(--bigger-radius);
		background: var(--bg-color);
		color: var(--text-color);
		font-size: 14px;
	}
	.label {
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--text-muted);
	}

	/* ── Stripe button ── */
	.stripe-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 16px;
		padding: 0.9rem 2rem;
		cursor: pointer;
	}
	.stripe-lock {
		font-size: 14px;
	}

	@media (max-width: 614px) {
		.checkout { padding-inline: 1.2rem; }
	}
</style>