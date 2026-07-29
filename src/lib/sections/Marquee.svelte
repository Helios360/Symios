<script lang="ts">
	import { reveal } from '$lib/motion/reveal';
	import { float } from '$lib/motion/float';
</script>

<section class="marquee-section" use:reveal>
	<div class="marquee-track" use:float={{ amp: 3, period: 4, phase: 1 }}>
		<div class="marquee-content">
			<span class="marquee-item">agents IA sur-mesure</span>
			<span class="marquee-dot">✦</span>
			<span class="marquee-item">documentation fournie</span>
			<span class="marquee-dot">✦</span>
			<span class="marquee-item">déploiement 14 jours</span>
			<span class="marquee-dot">✦</span>
			<span class="marquee-item">open-source friendly</span>
			<span class="marquee-dot">✦</span>
			<span class="marquee-item">abonnement · forfait · à l'heure</span>
			<span class="marquee-dot">✦</span>
			<!-- Duplicate for seamless loop -->
			<span class="marquee-item">agents IA sur-mesure</span>
			<span class="marquee-dot">✦</span>
			<span class="marquee-item">documentation fournie</span>
			<span class="marquee-dot">✦</span>
			<span class="marquee-item">déploiement 14 jours</span>
			<span class="marquee-dot">✦</span>
			<span class="marquee-item">open-source friendly</span>
			<span class="marquee-dot">✦</span>
			<span class="marquee-item">abonnement · forfait · à l'heure</span>
			<span class="marquee-dot">✦</span>
		</div>
	</div>
</section>

<style>
	.marquee-section {
		width: 100vw;
		background: var(--primary);
		color: var(--text-ondark);
		padding: 12px 0;
		position: relative;
		z-index: 10;
		margin-inline: calc(50% - 50vw);

	}

	.marquee-track {
		overflow: hidden;
		width: 100%;
	}

	.marquee-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		white-space: nowrap;
		animation: symios-marquee 26s linear infinite;
		width: fit-content;
	}

	.marquee-item {
		font-family: 'details', monospace;
		font-size: 13px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	.marquee-dot {
		color: var(--amber, #e0982f);
		font-size: 10px;
		margin: 0 0.6rem;
	}

	@keyframes symios-marquee {
		from { transform: translateX(0); }
		to { transform: translateX(-50%); }
	}

	@media (prefers-reduced-motion: reduce) {
		.marquee-content {
			animation: none;
		}
	}
</style>