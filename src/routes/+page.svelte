<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	import Hero from '$lib/sections/Hero.svelte';
	import Marquee from '$lib/sections/Marquee.svelte';
	import Stats from '$lib/sections/Stats.svelte';
	import Catalogue from '$lib/sections/Catalogue.svelte';
	import Terminal from '$lib/sections/Terminal.svelte';
	import Protocol from '$lib/sections/Protocol.svelte';
	import Cta from '$lib/sections/Cta.svelte';

	// ShapeField loads Three.js client-side only
	let showShapes = $state(false);

	onMount(() => {
		showShapes = true;
	});
</script>

<div class="page-wrapper">
	{#if showShapes}
		{#await import('$lib/three/ShapeField.svelte')}
			<div class="shape-placeholder" aria-hidden="true"></div>
		{:then ShapeField}
			<ShapeField.default />
		{:catch}
			<!-- Three.js non disponible — affichage normal sans dégradé -->
		{/await}
	{/if}

	<div class="content-layer">
		<Hero />
		<Marquee />
		<Stats
			stats={[
				{ number: '15+', title: 'Projets', value: 15 },
				{ number: '10', title: 'Missions réalisées', value: 10 },
				{ number: '100%', title: 'Uptime', value: 100 },
				{ number: '24/7', title: 'Support', value: 24 }
			]}
		/>
		<Catalogue
			modules={data.showcase.map((a) => ({
				id: a.id,
				title: a.title,
				subtitle: a.subtitle,
				price: a.price,
				category: a.category,
				features: a.features || []
			}))}
		/>
		<Terminal />
		<Protocol />
		<Cta />
	</div>
</div>

<style>
	.page-wrapper {
		position: relative;
		min-height: 100vh;
	}

	.content-layer {
		position: relative;
		z-index: 10;
	}
</style>
