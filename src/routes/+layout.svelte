<script lang="ts">
	import '../styles/app.css';
	import { page } from '$app/state';
	import type { LayoutData } from './$types';
	let { children, data }: { children: any; data: LayoutData } = $props();

	const SITE_URL = 'https://www.symios.com';
    const SITE_NAME = 'Symios';
    const DEFAULT_TITLE = "Symios | Intégrateur IA";
    const DEFAULT_DESCRIPTION = "Pâtisseries artisanales dans l'Oise : number cakes, gâteaux à thèmes, petits fours sucrés/salés. Ingrédients de qualité et décors faits main. Commandez en ligne.";
    const OG_IMAGE = `${SITE_URL}/images/icon.png`;
    let canonical = $derived(`${SITE_URL}${page.url.pathname === '/' ? '/' : page.url.pathname.replace(/\/$/, '')}`);
	const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Bakery',
        name: SITE_NAME,
        url: SITE_URL,
        image: OG_IMAGE,
        description: DEFAULT_DESCRIPTION,
        priceRange: '€€',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Canny-sur-Matz',
            addressRegion: 'Oise',
            addressCountry: 'FR'
        },
        areaServed: { '@type': 'AdministrativeArea', name: "Oise" },
        sameAs: [
            'https://www.facebook.com/larecette60/',
            'https://www.instagram.com/larecette_60',
            'https://www.tiktok.com/@mimimacaron60'
        ]
    };
</script>

<svelte:head>
    <title>{DEFAULT_TITLE}</title>
    <meta name="description" content={DEFAULT_DESCRIPTION}>
    <link rel="canonical" href={canonical}>
    <meta name="author" content={SITE_NAME}>
    <meta name="keywords" content="Symios, ia, IA, AI, ai, agents, agent, transition, technologique, futur, entreprises">

    <link rel="icon" type="image/webp" sizes="180x180" href="/images/favicon.png">
    <link rel="shortcut icon" href="/images/larecetteIcon.ico">
    <link rel="apple-touch-icon" href="/images/larecette.webp">

    <meta property="og:type" content="website">
    <meta property="og:locale" content="fr_FR">
    <meta property="og:site_name" content={SITE_NAME}>
    <meta property="og:title" content={DEFAULT_TITLE}>
    <meta property="og:description" content={DEFAULT_DESCRIPTION}>
    <meta property="og:url" content={canonical}>
    <meta property="og:image" content={OG_IMAGE}>
    <meta property="og:image:alt" content="La Recette — pâtisseries artisanales">

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
		<!--<a href="/account" aria-label="Mon compte" class="account-link" class:active={isActive('/account')} aria-current={isActive('/account') ? 'page' : undefined}>
            <svg width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5m0-8a3 3 0 1 1-3 3 3 3 0 0 1 3-3m9 17v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1Z"/>
            </svg>
        </a>
	-->
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

<main>
	{@render children()}
</main>
<br>
<footer>
    <a href="/" style="background-color:aliceblue;"><img src="/images/logo.png" height="100px" alt="SYMIOS"></a>
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