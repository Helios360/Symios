<script lang="ts">
	import { onMount } from 'svelte';

	const STORAGE_KEY = 'cookies_accepted';

	let visible = $state(false);

	onMount(() => {
		// Ne réaffiche le bandeau que si aucun choix n'a encore été fait.
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored !== 'accepted' && stored !== 'refused') {
			visible = true;
		}
	});

	function choose(choice: 'accepted' | 'refused') {
		localStorage.setItem(STORAGE_KEY, choice);
		visible = false;
	}
</script>

{#if visible}
	<div class="cookie-banner" role="dialog" aria-live="polite" aria-label="Consentement aux cookies">
		<div class="cookie-text">
			<p class="cookie-title">🍪 Cookies</p>
			<p>
				Ce site utilise des <strong>cookies techniques</strong> (session, panier) nécessaires à son
				bon fonctionnement, ainsi que des <strong>cookies analytiques</strong> anonymisés pour
				mesurer l'audience (durée de conservation : 13 mois).
				<a class="cookie-link" href="/mentions-legales">Mentions légales →</a>
			</p>
		</div>
		<div class="cookie-actions">
			<button type="button" class="btn-accept" onclick={() => choose('accepted')}>Accepter</button>
			<button type="button" class="btn-refuse" onclick={() => choose('refused')}>Refuser</button>
		</div>
	</div>
{/if}

<style>
	.cookie-banner {
		position: fixed;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		width: min(760px, calc(100vw - 2rem));
		z-index: 500;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.2rem;
		padding: 1.1rem 1.3rem;
		background: var(--primary);
		color: var(--text-ondark);
		font-family: "subtext", monospace; /* JetBrains Mono */
		font-size: 12.5px;
		line-height: 1.6;
		border: var(--line) solid #2dd4bf;
		box-shadow: 6px 6px 0 0 #2dd4bf; /* shadow dure néo-brutaliste, accent cyan */
	}

	.cookie-text {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.cookie-title {
		font-family: "subtext", monospace;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #2dd4bf;
	}

	.cookie-text p {
		margin: 0;
	}

	.cookie-link {
		color: #2dd4bf;
		text-decoration: underline;
		white-space: nowrap;
	}
	.cookie-link:hover {
		color: #99f6e4;
	}

	.cookie-actions {
		display: flex;
		gap: 0.7rem;
		flex-shrink: 0;
	}

	.btn-accept,
	.btn-refuse {
		font-family: "subtext", monospace; /* JetBrains Mono */
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 0.6rem 1rem;
		cursor: pointer;
		border: var(--line) solid var(--primary);
		box-shadow: 3px 3px 0 0 var(--primary);
		transition: transform 0.12s ease, box-shadow 0.12s ease;
	}

	.btn-accept {
		background: #2dd4bf;
		color: #042f2e;
	}
	.btn-accept:hover {
		transform: translate(-2px, -2px);
		box-shadow: 5px 5px 0 0 var(--primary);
	}

	.btn-refuse {
		background: transparent;
		color: var(--text-ondark);
		border-color: var(--text-muted);
	}
	.btn-refuse:hover {
		color: #2dd4bf;
		border-color: #2dd4bf;
	}

	@media (max-width: 640px) {
		.cookie-banner {
			flex-direction: column;
			align-items: stretch;
			text-align: left;
			gap: 0.9rem;
		}
		.cookie-actions {
			width: 100%;
		}
		.btn-accept,
		.btn-refuse {
			flex: 1;
		}
	}
</style>