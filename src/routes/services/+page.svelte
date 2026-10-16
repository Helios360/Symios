<script lang="ts">
	import { reveal } from '$lib/motion/reveal';
	import { tilt } from '$lib/motion/tilt';
	import { resolve } from '$app/paths';

	let filter = $state('all');

	const services = [
		{
			id: 'teams',
			icon: '☁️',
			title: 'Symios Teams',
			tagline: 'Suite collaborative souveraine',
			category: 'collaboration',
			tags: ['Collaboration', 'Souverain', 'IA privée'],
			desc: 'Nextcloud managé — fichiers, mail, agenda, visio, bureautique temps réel, IA privée. Alternative complète à M365 et Google Workspace.',
			detail: `
				<p>Nextcloud managé, auto-hébergé, chiffré, augmenté par l'IA — clé en main, sur votre infrastructure ou la nôtre.</p>
				<h4>Ce que nous livrons</h4>
				<ul>
					<li><strong>Fichiers & bureautique</strong> — stockage, sync, édition collaborative temps réel (Collabora), versionnage, partages fédérés</li>
					<li><strong>Collaboration</strong> — Talk (visio, appels, chat), mail, agenda, contacts, Deck, Notes, Photos, tableau blanc</li>
					<li><strong>Sécurité</strong> — ClamAV, audit admin, 2FA, politique de mots de passe, anti-bruteforce, LibreSign</li>
					<li><strong>IA privée</strong> — Assistant IA, Context Chat (RAG) sur vos documents — calculé localement, aucune donnée ne sort</li>
					<li><strong>Intégrations</strong> — OpenProject, Zammad, Analytics, 300+ apps</li>
				</ul>
				<h4>Pourquoi ça marche</h4>
				<ul>
					<li>Données hébergées où vous décidez (France / on-premise)</li>
					<li>Pas de licence par utilisateur — un serveur, des utilisateurs illimités</li>
					<li>Stack 100% Docker — reproductible à l'identique</li>
				</ul>
			`
		},
		{
			id: 'flow',
			icon: '⚡',
			title: 'Symios Flow',
			tagline: 'Automatisation sans code',
			category: 'automation',
			tags: ['Automatisation', 'Low-code', 'Workflows'],
			desc: "n8n managé — 400+ intégrations, workflows visuels, IA embarquée. Alternative souveraine à Zapier/Make, sans limite d'exécutions.",
			detail: `
				<p>n8n managé — une plateforme d'automatisation low-code qui connecte vos applications, automatise vos processus et intègre des agents IA.</p>
				<h4>Ce que nous livrons</h4>
				<ul>
					<li><strong>400+ intégrations</strong> — CRM, emails, bases de données, ERP, Google, Office 365, Slack, Telegram…</li>
					<li><strong>IA embarquée</strong> — nœuds OpenAI, Claude, Ollama, vector stores → RAG, agents, classification</li>
					<li><strong>Sécurité</strong> — RBAC, audit log, chiffrement des credentials, SSO/SAML/LDAP</li>
					<li><strong>Interface visuelle</strong> — éditeur drag-and-drop, historique des exécutions, versioning</li>
				</ul>
				<h4>Pourquoi ça marche</h4>
				<ul>
					<li>Pas de limite d'exécutions — contrairement à Zapier ou Make</li>
					<li>Extensible en code — nœuds custom JavaScript/TypeScript</li>
					<li>Données et exécutions 100% sur votre serveur</li>
				</ul>
			`
		},
		{
			id: 'agents',
			icon: '🤖',
			title: 'Symios AI Agents',
			tagline: 'Agents autonomes managés',
			category: 'ai',
			tags: ['IA', 'Autonome', 'Multi-modèle'],
			desc: 'Des agents IA qui travaillent vraiment — connectés à vos outils, APIs, données. Du simple assistant à l\'employé numérique temps plein.',
			detail: `
				<p>Nous concevons, déployons et opérons des agents IA autonomes — du simple assistant conversationnel au collaborateur numérique full-stack.</p>
				<h4>Types d'agents</h4>
				<ul>
					<li><strong>Claude Code</strong> — développeur/ops : écriture, refactoring, CI/CD, debug</li>
					<li><strong>Hermes</strong> — conversationnel : support client, RAG, multi-canal</li>
					<li><strong>OpenClaw</strong> — orchestrateur multi-agents : workflows complexes, délégation</li>
				</ul>
				<h4>Échelle de déploiement</h4>
				<ul>
					<li><strong>Assistant</strong> — tâches ponctuelles sur demande</li>
					<li><strong>Spécialiste</strong> — dédié à un domaine métier</li>
					<li><strong>Employé</strong> — intégré aux workflows quotidiens</li>
					<li><strong>Équipe</strong> — plusieurs agents qui collaborent</li>
				</ul>
			`
		},
		{
			id: 'custom-saas',
			icon: '🧰',
			title: 'Symios Custom SaaS',
			tagline: 'Développement & hébergement sur mesure',
			category: 'infrastructure',
			tags: ['Sur mesure', 'Full-stack', 'IA native'],
			desc: "Votre idée, notre stack. Design, développement full-stack, IA native, hébergement souverain. Du MVP à l'application scale.",
			detail: `
				<p>Nous transformons votre besoin métier en application SaaS clé en main — design, développement, hébergement, maintenance, IA incluse.</p>
				<h4>Ce que nous livrons</h4>
				<ul>
					<li><strong>Frontend</strong> — React / Next.js / Vue, responsive, dashboards interactifs</li>
					<li><strong>Backend</strong> — API REST / GraphQL, auth (SSO, OAuth, 2FA), RBAC, webhooks</li>
					<li><strong>DevOps</strong> — CI/CD automatisée, monitoring 24/7, backups, scalabilité</li>
					<li><strong>IA native</strong> — assistant, RAG, analyse prédictive, automatisation intelligente</li>
					<li><strong>Sécurité</strong> — TLS, Vault, audit logs, RGPD, pentest pré-prod</li>
				</ul>
				<h4>Packaging</h4>
				<ul>
					<li><strong>MVP</strong> — Startup / TPE : développement, hébergement, 1 agent IA</li>
					<li><strong>Growth</strong> — PME : itératif (6 sprints/an), IA avancée</li>
					<li><strong>Scale</strong> — ETI : équipe dédiée, micro-services, HA, 24/7</li>
				</ul>
			`
		},
		{
			id: 'ultra',
			icon: '🚀',
			title: 'Symios Ultra',
			tagline: 'Infrastructure numérique complète',
			category: 'infrastructure',
			tags: ['Plateforme', 'Tout-en-un', 'Microservices'],
			desc: "Construite de zéro : agents IA, WebRTC, APIs, collaboration, RAG. Pour les entreprises qui veulent le meilleur stack, intégré de A à Z.",
			detail: `
				<p>Symios Ultra n'est pas un empilement d'outils — c'est une plateforme intégrée qui couvre tous les besoins numériques d'une entreprise moderne.</p>
				<h4>Ce que ça inclut</h4>
				<ul>
					<li><strong>Agents IA autonomes</strong> — orchestrés, connectés à vos outils métier</li>
					<li><strong>WebRTC</strong> — audio/vidéo HD, conférences, partage d'écran, messagerie temps réel</li>
					<li><strong>API Gateway</strong> — GraphQL + REST, webhooks, rate-limiting, auth unifiée</li>
					<li><strong>App Hosting</strong> — exécution d'apps conteneurisées, app store interne</li>
					<li><strong>Collaboration</strong> — docs temps réel, sheets, kanban, partage de fichiers</li>
					<li><strong>RAG & vector store</strong> — recherche sémantique sur votre base documentaire</li>
				</ul>
				<h4>Architecture</h4>
				<p>Microservices avec API gateway, orchestrateur d'agents, WebRTC SFU (LiveKit/mediasoup), message bus (NATS/RabbitMQ), PostgreSQL + pgvector, Qdrant, MinIO/S3.</p>
			`
		},
		{
			id: 'stack',
			icon: '🧩',
			title: 'Symios Stack',
			tagline: 'Kit de démarrage souverain',
			category: 'infrastructure',
			tags: ['Starter', 'Intégré', 'Clé en main'],
			desc: 'Nextcloud + n8n + ERPNext + Vaultwarden + Authentik, pré-intégrés et durcis, déployés en un jour sur Infomaniak. Le socle complet.',
			detail: `
				<p>Nextcloud + n8n + ERPNext + Vaultwarden + Authentik — pré-intégrés, pré-durcis, prêts à l'emploi sur Infomaniak.</p>
				<h4>Ce que ça inclut</h4>
				<ul>
					<li><strong>Nextcloud</strong> — collaboration, fichiers, mail, visio</li>
					<li><strong>n8n</strong> — automatisation workflow, 400+ connecteurs</li>
					<li><strong>ERPNext</strong> — ERP complet (stocks, compta, RH, CRM)</li>
					<li><strong>Vaultwarden</strong> — gestionnaire de mots de passe</li>
					<li><strong>Authentik</strong> — SSO, annuaire unifié, permissions</li>
				</ul>
				<p>Le tout derrière un proxy TLS, avec sauvegardes automatisées, monitoring, et mises à jour continues.</p>
			`
		}
	];

	const products = [
		{ icon: '☁️', name: 'Symios Teams', desc: 'Suite collaborative Nextcloud — fichiers, calendrier, mail, chat, visio.' },
		{ icon: '⚡', name: 'Symios Flow', desc: 'Kits workflows pré-builds : Factur-X, URSSAF, GDPR, onboarding.' },
		{ icon: '🤖', name: 'Symios AI Agents', desc: 'Agents autonomes pour documents, emails, CRM, RAG.' },
		{ icon: '📊', name: 'Symios BI', desc: 'Rapports et dashboards branchés sur votre ERP et vos outils métier.' },
		{ icon: '🏭', name: 'Symios ERP', desc: 'ERPNext / Dolibarr déployé, customisé, maintenu.' },
		{ icon: '🔐', name: 'Symios Mesh', desc: 'SSO unifié — un annuaire, un modèle de permissions.' },
		{ icon: '🛡️', name: 'Symios Guard', desc: 'CIS hardening, scan vulnérabilités, audits RGPD.' },
		{ icon: '🧩', name: 'Symios Stack', desc: 'Le starter kit complet, pré-intégré, déployé en un jour.' }
	];

	let selected = $state<(typeof services)[0] | null>(null);

	function openModal(id: string) {
		selected = services.find((s) => s.id === id) ?? null;
	}

	function closeModal() {
		selected = null;
	}

	function onOverlayKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') closeModal();
	}

	// Lock page scroll while the modal is open
	$effect(() => {
		if (selected) {
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = '';
			};
		}
	});

	let filtered = $derived(
		filter === 'all' ? services : services.filter((s) => s.category === filter)
	);

	// Keyboard handler for modal
	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') selected = null;
	}
</script>

<svelte:window onkeydown={onKeydown} />

<section class="services-page">

	<!-- HERO -->
	<div class="hero" use:reveal>
		<div class="hero-text">
			<p class="section-index">// NOS SERVICES</p>
			<h1>Infrastructure <span class="accent">souveraine</span><br>pour entreprises <span class="accent">modernes</span></h1>
			<p class="hero-desc">
				Des outils open source, durcis, intégrés et opérés pour vous — sur des serveurs européens.
				Pas de lock-in, pas de surprise.
			</p>
		</div>
	</div>

	<!-- FILTERS -->
	<div class="filters" use:reveal>
		<button
			class="filter-btn"
			class:active={filter === 'all'}
			onclick={() => (filter = 'all')}>Tout voir</button>
		<button
			class="filter-btn"
			class:active={filter === 'collaboration'}
			onclick={() => (filter = 'collaboration')}>Collaboration</button>
		<button
			class="filter-btn"
			class:active={filter === 'automation'}
			onclick={() => (filter = 'automation')}>Automatisation</button>
		<button
			class="filter-btn"
			class:active={filter === 'ai'}
			onclick={() => (filter = 'ai')}>IA & Agents</button>
		<button
			class="filter-btn"
			class:active={filter === 'infrastructure'}
			onclick={() => (filter = 'infrastructure')}>Infrastructure</button>
	</div>

	<!-- SERVICE CARDS -->
	<div class="grid" use:reveal>
		{#each filtered as svc (svc.id)}
			<button class="card" onclick={() => openModal(svc.id)}>
				<div class="card-accent"></div>
				<span class="card-icon">{svc.icon}</span>
				<h3>{svc.title}</h3>
				<p class="card-tagline">{svc.tagline}</p>
				<p class="card-desc">{svc.desc}</p>
				<div class="card-tags">
					{#each svc.tags as tag}
						<span class="badge">{tag}</span>
					{/each}
				</div>
				<span class="card-link">Explorer →</span>
			</button>
		{/each}
	</div>

	{#if !filtered.length}
		<div class="empty-state" use:tilt={{ max: 2, perspective: 1100 }}>
			<p>Aucun service trouvé</p>
		</div>
	{/if}

	<!-- PRODUCT LINES -->
	<section class="product-section" use:reveal>
		<h2>Tous nos produits</h2>
		<p class="product-subtitle">Des couches fines et puissantes, conçues pour répondre à un besoin précis — toutes sur le même socle souverain.</p>
		<div class="product-grid">
			{#each products as prod}
				<div class="product-tile">
					<span class="tile-icon">{prod.icon}</span>
					<h4>{prod.name}</h4>
					<p>{prod.desc}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- CTA -->
	<section class="cta-section" use:reveal>
		<div class="cta-card" use:tilt={{ max: 2, perspective: 1100 }}>
			<p class="section-index">// ENVIE D'ALLER PLUS LOIN ?</p>
			<h2>Parlons de votre projet</h2>
			<p>Chaque besoin est unique. Je vous écoute, je vous conseille, et je construis la solution qui vous correspond.</p>
			<a href="{resolve('/project')}" class="cta">Démarrer un projet →</a>
		</div>
	</section>

</section>

<!-- MODAL -->
{#if selected}
	<div class="modal-overlay" onclick={closeModal} onkeydown={onOverlayKeydown} role="presentation"></div>
	<div class="modal" role="dialog" aria-modal="true" aria-label={selected.title}>
		<button class="modal-close" onclick={closeModal}>✕</button>
		<span class="modal-icon">{selected.icon}</span>
		<h2>{selected.title}</h2>
		<p class="modal-tagline">{selected.tagline}</p>
		<div class="modal-body">
			{@html selected.detail}
		</div>
		<div class="modal-bottom">
			<a href="{resolve('/project')}" class="cta">Demander un devis →</a>
		</div>
	</div>
{/if}

<style>
	/* ── Layout ── */
	.services-page {
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 clamp(1rem, 3vw, 4rem) 4rem;
	}

	/* ── Hero ── */
	.hero {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 4rem;
		align-items: end;
		padding: 6rem 0 4rem;
		min-height: 60vh;
	}

	.hero-text h1 {
		font-family: "Monoton", sans-serif;
		font-weight: 800;
		font-size: clamp(2.2rem, 5vw, 4.2rem);
		line-height: 1.02;
		margin: 1rem 0 1.5rem;
		text-transform: uppercase;
	}

	.accent { color: var(--accent); }

	.hero-desc {
		font-size: clamp(0.95rem, 1.2vw, 1.1rem);
		line-height: 1.7;
		color: var(--text-muted);
		max-width: 520px;
	}

	.section-index {
		color: var(--accent);
		text-transform: uppercase;
		font-size: 12.5px;
		font-family: "details", serif;
		letter-spacing: 0.05em;
	}

	/* ── Filters ── */
	.filters {
		display: flex;
		gap: 0.6rem;
		flex-wrap: wrap;
		margin-bottom: 3rem;
		padding: 1rem 0;
		border-top: 1px solid var(--background-accent);
		border-bottom: 1px solid var(--background-accent);
	}

	.filter-btn {
		padding: 0.6rem 1.2rem;
		border: 2px solid var(--primary);
		border-radius: 100px;
		background: transparent;
		font-family: "subtext", monospace;
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.25s;
		color: var(--primary);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
	.filter-btn:hover {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--text-ondark);
	}
	.filter-btn.active {
		background: var(--primary);
		border-color: var(--primary);
		color: var(--text-ondark);
	}

	/* ── Card grid ── */
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1.5rem;
	}

	.card {
		background: var(--surface);
		border: 2px solid var(--primary);
		border-radius: var(--bigger-radius);
		padding: 2rem;
		cursor: pointer;
		transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		box-shadow: var(--shadow-hard);
		text-align: left;
		font-family: inherit;
		color: inherit;
		position: relative;
		overflow: hidden;
	}
	.card:hover {
		transform: translate(-3px, -3px);
		box-shadow: 9px 9px 0 0 var(--primary);
		border-color: var(--accent);
	}
	.card:focus-visible {
		outline: 3px solid var(--accent);
		outline-offset: 3px;
	}

	.card-accent {
		position: absolute;
		top: 0; left: 0;
		width: 100%; height: 4px;
		background: var(--accent);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.35s ease;
	}
	.card:hover .card-accent { transform: scaleX(1); }

	.card-icon { font-size: 2.2rem; display: block; margin-bottom: 0.8rem; }

	.card h3 {
		font-family: "Monoton", sans-serif;
		font-weight: 700;
		font-size: 1.2rem;
		margin-bottom: 0.2rem;
		color: var(--primary);
	}

	.card-tagline {
		font-size: 0.8rem;
		color: var(--accent);
		font-weight: 600;
		margin-bottom: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-family: "details", serif;
	}

	.card-desc {
		font-size: 0.88rem;
		line-height: 1.6;
		color: var(--text-color);
	}

	.card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 1rem;
	}

	.badge {
		display: inline-block;
		background: var(--background-accent);
		padding: 0.2rem 0.6rem;
		border-radius: 4px;
		font-size: 0.62rem;
		font-family: "subtext", monospace;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--primary);
	}

	.card-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		margin-top: 1.2rem;
		font-family: "subtext", monospace;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--accent);
		transition: gap 0.2s;
	}
	.card:hover .card-link { gap: 0.8rem; }

	/* ── Empty state ── */
	.empty-state {
		text-align: center;
		padding: 4rem;
		color: var(--text-muted);
		font-family: "details", serif;
		font-size: 0.9rem;
		text-transform: uppercase;
	}

	/* ── Product lines ── */
	.product-section {
		margin-top: 6rem;
		padding: 4rem 0;
		border-top: 2px solid var(--primary);
	}

	.product-section h2 {
		font-family: "Monoton", sans-serif;
		font-weight: 800;
		font-size: clamp(1.6rem, 3vw, 2.4rem);
		margin-bottom: 0.5rem;
		color: var(--primary);
	}

	.product-subtitle {
		color: var(--text-muted);
		max-width: 600px;
		margin-bottom: 3rem;
		line-height: 1.7;
		font-size: 0.95rem;
	}

	.product-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
		gap: 0.8rem;
	}

	.product-tile {
		background: var(--surface);
		border: 2px solid var(--primary);
		border-radius: var(--bigger-radius);
		padding: 1.3rem;
		transition: all 0.2s;
		box-shadow: var(--shadow-hard-sm);
	}
	.product-tile:hover {
		transform: translate(-2px, -2px);
		box-shadow: 5px 5px 0 0 var(--primary);
		border-color: var(--accent);
	}

	.tile-icon { font-size: 1.5rem; display: block; margin-bottom: 0.5rem; }

	.product-tile h4 {
		font-family: "Monoton", sans-serif;
		font-weight: 600;
		font-size: 0.95rem;
		margin-bottom: 0.3rem;
		color: var(--primary);
	}

	.product-tile p {
		font-size: 0.78rem;
		color: var(--text-muted);
		line-height: 1.5;
	}

	/* ── CTA ── */
	.cta-section {
		margin-top: 5rem;
	}
	.cta-card {
		background: var(--surface);
		border: 2px solid var(--primary);
		border-radius: var(--bigger-radius);
		padding: 3rem;
		box-shadow: var(--shadow-hard);
		transform-style: preserve-3d;
	}
	.cta-card h2 {
		font-family: "Monoton", sans-serif;
		font-weight: 800;
		font-size: clamp(1.5rem, 3vw, 2.4rem);
		color: var(--primary);
		margin: 1rem 0;
	}
	.cta-card p {
		color: var(--text-muted);
		line-height: 1.7;
		margin-bottom: 1.5rem;
		max-width: 500px;
	}

	/* ── Modal ── */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0,0,0,0.55);
		z-index: 500;
		animation: fadein 0.2s ease;
	}

	.modal {
		position: fixed;
		top: 50%; left: 50%;
		transform: translate(-50%, -50%);
		background: var(--surface);
		border: 2px solid var(--primary);
		border-radius: var(--bigger-radius);
		padding: 2.5rem;
		max-width: 600px;
		width: calc(100% - 2rem);
		max-height: 85vh;
		overflow-y: auto;
		z-index: 501;
		box-shadow: 10px 10px 0 0 var(--primary);
		animation: modalin 0.25s cubic-bezier(0.16, 1, 0.3, 1);
	}

	@keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
	@keyframes modalin {
		from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
		to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
	}

	.modal-close {
		position: absolute;
		top: 1rem; right: 1.2rem;
		background: none;
		border: 2px solid transparent;
		font-size: 1.3rem;
		cursor: pointer;
		color: var(--text-muted);
		transition: color 0.2s;
		padding: 0.3rem 0.5rem;
		border-radius: var(--smaller-radius);
	}
	.modal-close:hover { color: var(--accent); border-color: var(--accent); }

	.modal-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }

	.modal h2 {
		font-family: "Monoton", sans-serif;
		font-weight: 700;
		font-size: 1.6rem;
		color: var(--primary);
		margin-bottom: 0.3rem;
		padding-right: 2rem;
	}

	.modal-tagline {
		color: var(--accent);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 0.78rem;
		font-family: "details", serif;
		margin-bottom: 1.5rem;
	}

	.modal-body {
		color: var(--text-color);
		line-height: 1.8;
		font-size: 0.92rem;
	}

	:global(.modal-body h4) {
		font-family: "Monoton", sans-serif;
		font-weight: 600;
		font-size: 1rem;
		color: var(--primary);
		margin-top: 1.2rem;
		margin-bottom: 0.4rem;
	}

	:global(.modal-body ul) {
		margin: 0.5rem 0 1rem;
		padding-left: 1.2rem;
		list-style: disc;
	}
	:global(.modal-body li) {
		margin-bottom: 0.4rem;
	}

	.modal-bottom {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--background-accent);
	}

	/* ── Responsive ── */
	@media (max-width: 800px) {
		.hero { grid-template-columns: 1fr; padding-top: 3rem; }
		.grid { grid-template-columns: 1fr; }
		.product-grid { grid-template-columns: 1fr 1fr; }
		.modal { padding: 1.8rem; }
	}
	@media (max-width: 500px) {
		.product-grid { grid-template-columns: 1fr; }
		.filters { gap: 0.4rem; }
		.filter-btn { font-size: 0.7rem; padding: 0.5rem 1rem; }
	}

	@media (prefers-reduced-motion: reduce) {
		*,*::before,*::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
	}
</style>