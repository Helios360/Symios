<script lang="ts">
	import { reveal } from '$lib/motion/reveal';
	import { litText } from '$lib/motion/litText';
	import { float } from '$lib/motion/float';
</script>

<section class="manifesto-section" use:reveal>
	<div class="manifesto-inner" use:float={{ amp: 5, period: 3.8, phase: 0.5 }}>
		<p class="section-index">// LE MANIFESTE</p>
		<p class="manifesto-text" use:litText>
			Symios construit les infrastructures agentiques de demain.
			Pas de bullshit, pas de promesses vides — des agents opérationnels,
			documentés, livrés clé en main. Nous croyons en une IA transparente,
			open-source quand c'est possible, toujours explicable.
			La technique au service du terrain, pas l'inverse.
		</p>
	</div>
</section>

<style>
	.manifesto-section {
		padding: 6rem 2rem;
		position: relative;
		z-index: 10;
	}

	.manifesto-inner {
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.manifesto-text {
		font-family: 'artistic', serif;
		font-size: clamp(26px, 3.3vw, 46px);
		font-weight: 700;
		line-height: 1.25;
		color: var(--primary);
	}
</style>