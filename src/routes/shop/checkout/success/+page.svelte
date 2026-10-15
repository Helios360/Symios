<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/motion/reveal';
	import { tilt } from '$lib/motion/tilt';

	let sessionId = $derived(page.url.searchParams.get('session_id') ?? '');
</script>

<svelte:head><title>Paiement réussi | Symios</title></svelte:head>

<section class="success" use:reveal>
	<p class="section-index">// CONFIRMATION</p>
	<h1>Paiement réussi !</h1>
	<p class="lead">
		Merci pour votre commande. Vous allez recevoir un e-mail de confirmation
		avec les détails sous peu.
	</p>

	<div class="terminal-card" use:tilt>
		<div class="terminal-bar">
			<span class="term-dot term-dot--red"></span>
			<span class="term-dot term-dot--amber"></span>
			<span class="term-dot term-dot--green"></span>
			<span class="term-title mono-alt">checkout.sh</span>
		</div>
		<div class="terminal-body mono">
			<div class="cmd">&gt; symios payment --confirm {sessionId ? sessionId.slice(0, 8) + '…' : '✓'}</div>
			<div class="out green">status: completed</div>
			<div class="out">Un e-mail récapitulatif arrive dans votre boîte.</div>
		</div>
	</div>

	<div class="actions">
		<a href="{resolve('/account')}" class="cta">Voir mes commandes →</a>
		<a href="{resolve('/shop')}" class="cta-light">Continuer les achats</a>
	</div>
</section>

<style>
	.success {
		max-width: 640px;
		margin-inline: auto;
		padding: 3rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		align-items: center;
		text-align: center;
	}
	.success h1 {
		margin-top: 0.4rem;
		color: var(--olive);
	}
	.lead {
		font-size: 16px;
		line-height: 1.6;
		color: var(--text-muted);
		max-width: 480px;
	}

	/* ── Terminal card ── */
	.terminal-card {
		width: 100%;
		max-width: 480px;
		overflow: hidden;
		border: var(--line) solid var(--primary);
		border-radius: var(--bigger-radius);
		box-shadow: var(--shadow-hard);
		background-color: #1c140d;
		transform-style: preserve-3d;
		margin: 1rem 0;
	}
	.terminal-bar {
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
	.terminal-bar .term-title { margin-left: auto; }
	.terminal-body {
		padding: 26px 24px;
		font-size: 13.5px;
		line-height: 1.9;
		text-align: left;
	}
	.terminal-body .cmd { color: var(--amber); }
	.terminal-body .out { color: #c3b294; }
	.terminal-body .out.green { color: var(--olive); }

	.actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	@media (max-width: 614px) {
		.success { padding-inline: 1.2rem; }
	}
</style>