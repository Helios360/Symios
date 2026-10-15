<script lang="ts">
	import { page } from '$app/state';
	import { resolve, asset } from '$app/paths';
	import type { LayoutData } from './$types';
	import { scrollSpeed } from '$lib/motion/scrollSpeed';
	import '../styles/app.css';

	let { children, data }: { children: any; data: LayoutData } = $props();

	let mobileNavOpen = $state(false);

	const SITE_URL = 'https://www.symios.com';
	const SITE_NAME = 'Symios';
	const DEFAULT_TITLE = "Symios | Agents IA sur-mesure";
	const DEFAULT_DESCRIPTION = "Je conçois, déploie et documente des agents IA sur-mesure pour les entreprises. Audit, architecture, déploiement — livré avec sa documentation.";
	const OG_IMAGE = `${SITE_URL}/images/icon.png`;

	let canonical = $derived(`${SITE_URL}${page.url.pathname === '/' ? '/' : page.url.pathname.replace(/\/$/, '')}`);

	// Per-page title: use page-level <svelte:head> if set, otherwise fallback
	let pageTitle = $derived(page.url.pathname.includes('contact') ? 'Contact | Symios' :
		page.url.pathname.includes('shop/checkout/success') ? 'Paiement réussi | Symios' :
		page.url.pathname.includes('shop/checkout') ? 'Paiement | Symios' :
		page.url.pathname.includes('shop') ? 'Boutique | Symios' :
		page.url.pathname.includes('blog') ? 'Blog | Symios' :
		page.url.pathname.includes('account') ? 'Mon compte | Symios' :
		page.url.pathname.includes('admin') ? 'Admin | Symios' :
		DEFAULT_TITLE
	);

	let pageDesc = $derived(
		page.url.pathname.includes('contact') ? "Contactez Symios — Elias Treguier. Téléphone, email, GitHub, LinkedIn." :
		page.url.pathname.includes('shop') ? "Abonnements, forfaits, heures, formations et ressources IA." :
		page.url.pathname.includes('blog') ? "Articles, guides et réflexions autour des agents IA, de l'automatisation et du déploiement." :
		page.url.pathname.includes('account') ? "Connectez-vous ou créez votre compte Symios." :
		page.url.pathname.includes('admin') ? "Administration Symios." :
		DEFAULT_DESCRIPTION
	);

	const JSONLD = {
		'@context': 'https://schema.org',
		'@type': 'ProfessionalService',
		name: SITE_NAME,
		url: SITE_URL,
		image: OG_IMAGE,
		description: DEFAULT_DESCRIPTION,
		priceRange: '€€–€€€',
		address: { '@type': 'PostalAddress', addressCountry: 'FR' },
		areaServed: { '@type': 'AdministrativeArea', name: "France" },
		sameAs: [
			'https://github.com/symios',
			'https://www.linkedin.com/company/symios'
		]
	};
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDesc}>
	<link rel="canonical" href={canonical}>
	<meta name="author" content={SITE_NAME}>
	<meta name="keywords" content="Symios, IA, agents, intelligence artificielle, intégrateur, automation, entreprise, France">
	<meta name="robots" content="index, follow">

	<link rel="icon" type="image/png" sizes="180x180" href="{asset('/images/favicon.png')}">
	<link rel="shortcut icon" href="{asset('/images/favicon.png')}">
	<link rel="apple-touch-icon" href="{asset('/images/icon.png')}">

	<!-- Preconnect for font loading -->
	<link rel="dns-prefetch" href="https://fonts.gstatic.com">
	<link rel="preconnect" href="https://www.symios.com">

	<meta property="og:type" content="website">
	<meta property="og:locale" content="fr_FR">
	<meta property="og:site_name" content={SITE_NAME}>
	<meta property="og:title" content={pageTitle}>
	<meta property="og:description" content={pageDesc}>
	<meta property="og:url" content={canonical}>
	<meta property="og:image" content={OG_IMAGE}>
	<meta property="og:image:alt" content="Symios — Intégrateur IA">

	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content={pageTitle}>
	<meta name="twitter:description" content={pageDesc}>
	<meta name="twitter:image" content={OG_IMAGE}>

	<!-- Preload hero image -->
	<link rel="preload" as="image" href="{asset('/images/Boutique.png')}" fetchpriority="high">

	{@html `<script type="application/ld+json">${JSON.stringify(JSONLD)}</` + `script>`}
</svelte:head>

<!-- Skip-to-content link -->
<a href="#main-content" class="skip-link">Aller au contenu</a>

<header class="site-header">
	<a href={resolve('/')}><img src="{asset('/images/logo.png')}" alt="SYMIOS" width="120" height="80"></a>
	<!-- Desktop nav -->
	<nav class="desktop-nav" aria-label="Navigation principale">
		<a href="{resolve('/services')}">services</a>
		<a href="{resolve('/shop')}">shop</a>
		<a href="{resolve('/blog')}">blog</a>
		<a href="{resolve('/ressources')}">ressources</a>
		<a href="{resolve('/contact')}">contact</a>
		{#if data.isAdmin}
			<a href="{resolve('/admin')}">admin</a>
		{/if}
		<a href="{resolve('/project')}" class="cta">démarrer un projet</a>
	</nav>
	<!-- Mobile toggle -->
	<button class="mobile-toggle no-print" aria-label="Menu" aria-expanded={mobileNavOpen} onclick={() => (mobileNavOpen = !mobileNavOpen)}>
		<span class="hamburger-line" class:open={mobileNavOpen}></span>
	</button>
</header>

{#if mobileNavOpen}
	<!-- Mobile nav overlay -->
	<nav class="mobile-nav no-print" aria-label="Navigation mobile">
		<a href="{resolve('/services')}" onclick={() => (mobileNavOpen = false)}>services</a>
		<a href="{resolve('/shop')}" onclick={() => (mobileNavOpen = false)}>shop</a>
		<a href="{resolve('/blog')}" onclick={() => (mobileNavOpen = false)}>blog</a>
		<a href="{resolve('/ressources')}" onclick={() => (mobileNavOpen = false)}>ressources</a>
		<a href="{resolve('/contact')}" onclick={() => (mobileNavOpen = false)}>contact</a>
		{#if data.isAdmin}
			<a href="{resolve('/admin')}" onclick={() => (mobileNavOpen = false)}>admin</a>
		{/if}
		<a href="{resolve('/project')}" class="cta" onclick={() => (mobileNavOpen = false)}>démarrer un projet</a>
	</nav>
{/if}

<div class="subheader">
	<span>
		<a href="https://github.com/symios" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><u>github</u></a> x
		<a href="https://youtube.com/@symios" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><u>youtube</u></a> x
		<a href="https://instagram.com/symios" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><u>instagram</u></a>
	</span>
	<span class="account-links">
		{#if data.cartCount > 0}
			<a href="{resolve('/account#panier')}"><u>panier ({data.cartCount})</u></a>&nbsp;x&nbsp;
		{/if}
		<a href="{resolve('/account')}"><u>mon compte →</u></a>
	</span>
</div>

<main id="main-content" use:scrollSpeed>
	{@render children()}
</main>

<footer class="site-footer">
	<a href={resolve('/')}><img src="{asset('/images/logo.png')}" alt="SYMIOS" width="150" height="100"></a>
	<div class="usefull-links">
		<span>
			<p style="color:var(--accent)">NAVIGUER</p>
			<a href={resolve('/')}>Accueil</a>
			<a href="{resolve('/services')}">Services</a>
			<a href="{resolve('/blog')}">Blog</a>
		</span>
		<span>
			<p style="color:var(--accent)">SUIVRE</p>
			<a href="https://github.com/symios" target="_blank" rel="noopener noreferrer">GitHub</a>
			<a href="https://www.linkedin.com/company/symios" target="_blank" rel="noopener noreferrer">LinkedIn</a>
			<a href="/" target="_blank" rel="noopener noreferrer" aria-label="RSS">RSS</a>
		</span>
	</div>
</footer>
<footer class="subfooter">
	<span>© {new Date().getFullYear()} symios — fait par hellios</span>
	<span>open-source friendly · <a href="{resolve('/cgv')}">CGV</a> · <a href="{resolve('/cgu')}">CGU</a> · <a href="{resolve('/mentions-legales')}">Mentions légales</a></span>
</footer>

<style>
	.subheader {
		background-color: var(--primary);
		color: var(--text-ondark);
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 1.2rem max(1.2rem, calc((100% - 1440px) / 2));
		font-size: 14px;
		font-family: "details", serif;
		text-transform: uppercase;
	}
	.subheader > span {
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}
	.account-links {
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}
	.subfooter {
		background-color: var(--primary);
		color: var(--text-muted);
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 0.6rem;
		padding: 1.1rem max(1.2rem, calc((100% - 1440px) / 2));
		border-top: 1px solid #4a3a28;
		font-size: 11px;
		letter-spacing: .1em;
		font-family: "details", monospace;
		text-transform: uppercase;
		position:relative;
		z-index: 50;
	}
	.usefull-links {
		color: var(--text-ondark);
		display: flex;
		gap: 2rem;
	}
	.usefull-links > span {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	/* ── Mobile hamburger ── */
	.desktop-nav {
		display: flex;
		align-items: center;
		gap: 2rem;
	}
	.mobile-toggle {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 8px;
		z-index: 200;
	}
	.hamburger-line,
	.hamburger-line::before,
	.hamburger-line::after {
		display: block;
		width: 24px;
		height: 2px;
		background: var(--primary);
		border-radius: 2px;
		transition: transform 0.3s, opacity 0.3s;
	}
	.hamburger-line {
		position: relative;
	}
	.hamburger-line::before,
	.hamburger-line::after {
		content: '';
		position: absolute;
		left: 0;
	}
	.hamburger-line::before { top: -8px; }
	.hamburger-line::after { top: 8px; }
	.hamburger-line.open {
		background: transparent;
	}
	.hamburger-line.open::before {
		transform: translateY(8px) rotate(45deg);
	}
	.hamburger-line.open::after {
		transform: translateY(-8px) rotate(-45deg);
	}

	.mobile-nav {
		position: fixed;
		inset: 0;
		z-index: 150;
		background: var(--background);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		font-family: "subtext", serif;
		font-size: 18px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		animation: symios-fadein 0.2s ease-out;
	}
	.mobile-nav .cta {
		font-size: 14px;
		margin-top: 1rem;
	}

	@keyframes symios-fadein {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	/* ── Responsive ── */
	@media (max-width: 760px) {
		.desktop-nav { display: none; }
		.mobile-toggle { display: block; }
		.subheader { font-size: 11px; padding: 0.8rem 1.2rem; }
		.subheader > span { gap: 0.8rem; flex-wrap: wrap; }
	}

	@media print {
		.no-print { display: none; }
	}
</style>