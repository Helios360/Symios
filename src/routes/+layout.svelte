<script lang="ts">
	import '../styles/app.css';
	import { page } from '$app/state';
	import type { LayoutData } from './$types';
	import { scrollSpeed } from '$lib/motion/scrollSpeed';
	let { children, data }: { children: any; data: LayoutData } = $props();

	const SITE_URL = 'https://www.symios.com';
    const SITE_NAME = 'Symios';
    const DEFAULT_TITLE = "Symios | Intégrateur IA";
    const DEFAULT_DESCRIPTION = "Hellios conçoit, déploie et documente des agents IA sur-mesure pour les entreprises. Audit, architecture, déploiement — livré avec sa documentation.";
    const OG_IMAGE = `${SITE_URL}/images/icon.png`;
    let canonical = $derived(`${SITE_URL}${page.url.pathname === '/' ? '/' : page.url.pathname.replace(/\/$/, '')}`);
	const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: SITE_NAME,
        url: SITE_URL,
        image: OG_IMAGE,
        description: DEFAULT_DESCRIPTION,
        priceRange: '€€–€€€',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'FR'
        },
        areaServed: { '@type': 'AdministrativeArea', name: "France" },
        sameAs: [
            'https://github.com/symios',
            'https://www.linkedin.com/company/symios'
        ]
    };
</script>

<svelte:head>
    <title>{DEFAULT_TITLE}</title>
    <meta name="description" content={DEFAULT_DESCRIPTION}>
    <link rel="canonical" href={canonical}>
    <meta name="author" content={SITE_NAME}>
    <meta name="keywords" content="Symios, IA, agents, intelligence artificielle, intégrateur, automation, entreprise, France">

    <link rel="icon" type="image/webp" sizes="180x180" href="/images/favicon.png">
    <link rel="shortcut icon" href="/images/favicon.ico">
    <link rel="apple-touch-icon" href="/images/icon.png">

    <meta property="og:type" content="website">
    <meta property="og:locale" content="fr_FR">
    <meta property="og:site_name" content={SITE_NAME}>
    <meta property="og:title" content={DEFAULT_TITLE}>
    <meta property="og:description" content={DEFAULT_DESCRIPTION}>
    <meta property="og:url" content={canonical}>
    <meta property="og:image" content={OG_IMAGE}>
    <meta property="og:image:alt" content="Symios — Intégrateur IA">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content={DEFAULT_TITLE}>
    <meta name="twitter:description" content={DEFAULT_DESCRIPTION}>
    <meta name="twitter:image" content={OG_IMAGE}>

    <link rel="preload" as="image" href="/images/Boutique.png">

    {@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</` + `script>`}
</svelte:head>

<header>
	<a href="/"><img src="/images/logo.png" height="80px" alt="SYMIOS"></a>
	<nav>
		<a href="/services">services</a>
		<a href="/shop">shop</a>
		<a href="/blog">blog</a>
		<a href="/ressources">ressources</a>
		<a href="/contact">contact</a>
		<a href="/project" class="cta">démmarer un projet</a>
	</nav>
</header>
<div class="subheader">
	<span>
		<a href="#"><u>github</u></a> x
		<a href="#"><u>youtube</u></a> x
		<a href="#"><u>instagram</u></a>
	</span>
    <span class="account-links">
        {#if data.cartCount > 0}
            <a href="/account#panier"><u>panier ({data.cartCount})</u></a> x
        {/if}
        <a href="/account"><u>mon compte →</u></a>
    </span>
</div>

<main use:scrollSpeed>
	{@render children()}
</main>
<br>
<footer>
    <a href="/"><img src="/images/logo.png" height="100px" alt="SYMIOS"></a>
    <div class="usefull-links">
        <span>
            <p style="color:var(--accent)">NAVIGUER</p>
            <a href="/">Accueil</a>
            <a href="/shop">Services</a>
            <a href="/blog">Blog</a>
        </span>
        <span>
            <p style="color:var(--accent)">SUIVRE</p>
            <a href="/">GitHub</a>
            <a href="/">LinkedIn</a>
            <a href="/">RSS</a>
        </span>
    </div>
</footer>
<footer class="subfooter">
    <span>© {new Date().getFullYear()} symios — fait par hellios</span>
    <span>open-source friendly · <a>CGV</a> · <a>GGU</a> · <a>Mentions légales</a></span>
</footer>

<style>
	.subheader{
		background-color: var(--primary);
		color:var(--text-ondark);
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 1.2rem max(1.2rem, calc((100% - 1440px) / 2));
		font-size:14px;
		font-family: "details", serif;
		text-transform: uppercase;
	}
    .subheader > span{
        display: flex;
        gap:1.5rem;
    }
    .account-links{
        display: flex;
        gap: 1.5rem;
        align-items: center;
    }
    .subfooter{
        background-color: var(--primary);
        color: var(--text-muted, #8a7d63);
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
    }
    .usefull-links{
        color: var(--text-ondark);
        display:flex;
        gap:2rem;
    }
    .usefull-links > span {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

</style>