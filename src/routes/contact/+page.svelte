<script lang="ts">
	import { reveal } from '$lib/motion/reveal';
	import { float } from '$lib/motion/float';
	import { tilt } from '$lib/motion/tilt';
</script>

<svelte:head>
	<title>Contact | Symios</title>
	<meta name="description" content="Contactez Symios — Elias Treguier. Téléphone, email, GitHub, LinkedIn. Entreprise virtuelle, sans adresse postale." />
</svelte:head>

<section class="contact-page">
	<header class="contact-head" use:reveal>
		<p class="section-index">// CONTACT</p>
		<h1>Me contacter</h1>
		<p class="contact-desc">
			Un projet, une question, une envie de collaborer&nbsp;?<br />
			Je suis à un clic — ou un appel — de distance.
		</p>
	</header>

	<div class="contact-grid">
		<!-- ─── Coordonnées (terminal card) ─── -->
		<div class="terminal-panel terminal-main" use:reveal use:tilt={{ max: 2, perspective: 1100 }}>
			<div class="term-header">
				<span class="term-dot term-dot--red"></span>
				<span class="term-dot term-dot--amber"></span>
				<span class="term-dot term-dot--green"></span>
				<span class="term-title mono-alt">contact.sh</span>
			</div>
			<div class="terminal-body">
				<div class="cmd-line">
					<span class="cmd-prompt">$</span>
					<span class="cmd-text">symios contact --direct</span>
				</div>

				<div class="contact-item">
					<span class="contact-label mono-alt">📞  téléphone</span>
					<a href="tel:+33628783585" class="contact-value">06 28 78 35 85</a>
				</div>

				<div class="contact-item">
					<span class="contact-label mono-alt">✉️  email</span>
					<a href="mailto:elias.treguier@gmail.com" class="contact-value">elias.treguier@gmail.com</a>
				</div>

				<div class="divider"></div>

				<div class="cmd-line">
					<span class="cmd-prompt">$</span>
					<span class="cmd-text">echo "pas d'adresse, je suis 100% en ligne"</span>
				</div>
				<div class="cmd-output">
					pas d'adresse, je suis 100% en ligne
				</div>
			</div>
		</div>

		<!-- ─── Liens sociaux ─── -->
		<div class="social-stack" use:reveal>
			<h2 class="section-index">// Retrouvez-moi</h2>

			<a href="https://github.com/Helios360" target="_blank" rel="noopener noreferrer"
				class="social-card panel" use:tilt={{ max: 2.5, perspective: 1100 }}>
				<div class="social-card-head">
					<span class="social-icon">🐙</span>
					<span class="mono-alt">github</span>
				</div>
				<div class="social-card-body">
					<p>/Helios360</p>
					<span class="mono-alt social-cta">ouvrir →</span>
				</div>
			</a>

			<a href="https://www.linkedin.com/in/elias-treguier-5234b7242/" target="_blank" rel="noopener noreferrer"
				class="social-card panel" use:tilt={{ max: 2.5, perspective: 1100 }}>
				<div class="social-card-head">
					<span class="social-icon">💼</span>
					<span class="mono-alt">linkedin</span>
				</div>
				<div class="social-card-body">
					<p>/in/elias-treguier</p>
					<span class="mono-alt social-cta">ouvrir →</span>
				</div>
			</a>

			<div class="social-card panel soon" use:tilt={{ max: 2.5, perspective: 1100 }}>
				<div class="social-card-head">
					<span class="social-icon">🔨</span>
					<span class="mono-alt">forgejo</span>
				</div>
				<div class="social-card-body">
					<p>Instance personnelle — bientôt publique</p>
					<span class="mono-alt social-cta">à venir</span>
				</div>
			</div>
		</div>
	</div>

	<!-- ─── CTA ─── -->
	<section class="contact-cta" use:reveal>
		<div class="cta-block panel" use:tilt={{ max: 2, perspective: 1100 }}>
			<div class="cta-inner" use:float={{ amp: 6, period: 3.6, phase: 0 }}>
				<h2>Une idée&nbsp;?<br />Un projet&nbsp;?</h2>
				<p>Écrivez-moi directement, on trouve un créneau.</p>
				<a href="mailto:elias.treguier@gmail.com" class="cta cta-inverse">Envoyer un email →</a>
			</div>
		</div>
	</section>
</section>

<style>
	/* ── Layout général ────────────────────────────────── */
	.contact-page {
		max-width: 1000px;
		margin-inline: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
		position: relative;
		z-index: 10;
	}

	.contact-head h1 {
		margin-top: 0.4rem;
	}
	.contact-desc {
		font-size: 14px;
		line-height: 1.55;
		color: var(--text-color);
		max-width: 540px;
		margin-top: 0.4rem;
	}

	/* ── Grille ────────────────────────────────────────── */
	.contact-grid {
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: 24px;
		align-items: start;
	}

	/* ── Terminal panel (coordonnées) ──────────────────── */
	.terminal-panel {
		border: 2px solid var(--primary);
		border-radius: var(--bigger-radius);
		overflow: hidden;
		background: #1c140d;
		box-shadow: var(--shadow-hard);
		transform-style: preserve-3d;
	}
	.terminal-body {
		padding: 22px 20px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.cmd-line {
		font-family: 'subtext', monospace;
		font-size: 13px;
		color: var(--amber);
		display: flex;
		gap: 10px;
		align-items: baseline;
	}
	.cmd-prompt {
		color: var(--olive);
		user-select: none;
	}
	.cmd-text {
		color: #c3b294;
	}
	.cmd-output {
		font-family: 'subtext', monospace;
		font-size: 13px;
		color: #8a7d63;
		padding-left: 22px;
		font-style: italic;
	}

	.divider {
		height: 1px;
		background: #4a3a28;
		margin: 4px 0;
	}

	.contact-item {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 12px 0;
		border-bottom: 1px solid #2f241a;
	}
	.contact-item:last-of-type {
		border-bottom: none;
	}
	.contact-label {
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--text-ondark);
		min-width: 100px;
	}
	.contact-value {
		font-family: 'visibility', sans-serif;
		font-size: 16px;
		color: var(--accent);
		text-decoration: none;
		transition: color 0.2s;
	}
	.contact-value:hover {
		color: #d97a2a;
		text-decoration: underline;
	}

	/* ── Social stack ──────────────────────────────────── */
	.social-stack {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.social-stack h2 {
		margin-bottom: 2px;
	}

	.social-card {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		text-decoration: none;
		transition: box-shadow 0.2s;
		transform-style: preserve-3d;
	}
	.social-card:hover {
		box-shadow: 8px 8px 0 0 var(--primary);
	}

	.social-card-head {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 16px;
		background: var(--primary);
		color: var(--text-ondark);
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.social-icon {
		font-size: 16px;
		line-height: 1;
	}
	.social-card-body {
		padding: 14px 16px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}
	.social-card-body p {
		font-family: 'visibility', sans-serif;
		font-size: 14px;
		font-weight: 600;
		color: var(--primary);
	}
	.social-cta {
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--accent);
		white-space: nowrap;
	}
	.soon .social-card-head {
		opacity: 0.6;
	}
	.soon .social-card-body p {
		opacity: 0.6;
		font-size: 13px;
	}
	.soon .social-cta {
		color: var(--text-muted);
	}
	.soon:hover {
		box-shadow: var(--shadow-hard) !important;
		cursor: default;
	}

	/* ── CTA ────────────────────────────────────────────── */
	.contact-cta {
		padding: 1rem 0;
	}
	.cta-block {
		max-width: 65%;
		background: var(--primary);
		border: var(--line) solid var(--primary);
		border-radius: var(--bigger-radius);
		box-shadow: 10px 10px 0 0 var(--accent);
		padding: 3rem 2.8rem;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		transform-style: preserve-3d;
	}
	.cta-inner {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.cta-block h2 {
		font-family: 'Monoton', sans-serif;
		font-weight: 800;
		font-size: 38px;
		text-transform: uppercase;
		color: var(--text-ondark);
		line-height: 0.95;
	}
	.cta-block p {
		font-size: 14px;
		line-height: 1.55;
		color: var(--text-muted);
	}
	.cta-inverse {
		background: var(--accent);
		color: var(--accent-color);
		border: 2px solid var(--text-ondark);
		box-shadow: 3px 3px 0 0 var(--text-ondark);
		align-self: flex-start;
		margin-top: 0.4rem;
	}

	/* ── Responsive ─────────────────────────────────────── */
	@media (max-width: 760px) {
		.contact-grid {
			grid-template-columns: 1fr;
		}
		.cta-block {
			max-width: 100%;
		}
		.contact-page {
			padding: 1.2rem;
		}
		.contact-item {
			flex-direction: column;
			align-items: flex-start;
			gap: 6px;
		}
		.contact-label {
			min-width: auto;
		}
		.cta-block h2 {
			font-size: 30px;
		}
	}
</style>