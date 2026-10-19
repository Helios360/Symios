<script lang="ts">
	import { resolve } from '$app/paths';
	import { reveal } from '$lib/motion/reveal';
	import { float } from '$lib/motion/float';
	import { tilt } from '$lib/motion/tilt';
</script>

<section class="cta-section" use:reveal>
	<div class="cta-block" use:tilt={{ max: 2, perspective: 1100 }} use:float={{ amp: 7, period: 3.6, phase: 0 }}>
		<div class="cta-inner">
			<h2>Prêt à passer<br />à l'action&nbsp;?</h2>
			<p>Un audit gratuit pour faire le point sur vos besoins et vos systèmes.</p>
			<div class="button-container">
				<a href="{resolve('/project')}" class="cta cta-inverse">Démarrer un projet →</a>
				<a href="{resolve('/services')}" class="cta-light">Voir nos services</a>
			</div>
		</div>
	</div>
</section>

<style>
	.cta-section {
		padding: 6rem 2rem;
		position: relative;
		z-index: 10;
	}

	.cta-block {
		max-width: 62%;
		background: var(--primary);
		border: var(--line) solid var(--primary);
		border-radius: var(--bigger-radius);
		box-shadow: 10px 10px 0 0 var(--accent);
		padding: 3.5rem 3rem;
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		transform-style: preserve-3d;
	}

	.cta-inner {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	h2 {
		color: var(--text-ondark);
	}

	.cta-block p {
		font-size: 15px;
		line-height: 1.55;
		color: var(--text-muted);
	}

	.cta-inverse {
		background: var(--accent);
		color: var(--accent-color);
		border: 2px solid var(--text-ondark);
		box-shadow: 3px 3px 0 0 var(--text-ondark);
	}

	.cta-block .cta-light {
		color: var(--text-ondark);
		border-color: var(--text-ondark);
	}
	@media (max-width:915px){
		.cta-block{
			width:100%;
			max-width:100%
		}
	}
</style>