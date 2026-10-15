<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>CGU | Symios</title>
	<meta name="description" content="Conditions Générales d'Utilisation du site Symios." />
</svelte:head>

<section class="legal-page">
	<a href={resolve('/')} class="back mono-alt">← Retour à l'accueil</a>

	<article class="legal-article">
		<header class="legal-header">
			<p class="section-index">// CGU</p>
			<h1>Conditions Générales d'Utilisation</h1>
			<p class="legal-meta mono-alt">Dernière mise à jour : septembre 2026</p>
		</header>

		<div class="legal-content">
			<h2>1. Objet</h2>
			<p>Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») régissent l'accès et l'utilisation du site internet accessible à l'adresse <a href="https://www.symios.com">www.symios.com</a> (le « Site »), édité par Elias Treguier, Entreprise Individuelle (EI).</p>
			<p>En naviguant sur le Site, vous reconnaissez avoir pris connaissance des présentes CGU et les accepter sans réserve.</p>

			<h2>2. Définitions</h2>
			<p>« Utilisateur » : toute personne physique ou morale accédant au Site.<br />
			« Contenu » : l'ensemble des informations, textes, images, vidéos, logos, marques et autres éléments présents sur le Site.<br />
			« Prestations » : les services proposés à la vente sur le Site (abonnements, forfaits, prestations à l'heure).</p>

			<h2>3. Accès au Site</h2>
			<p>Le Site est accessible gratuitement à tout Utilisateur disposant d'un accès à internet. Tous les frais nécessaires à l'accès au Site (équipement, connexion) sont à la charge de l'Utilisateur.</p>
			<p>L'éditeur se réserve le droit de suspendre ou de limiter l'accès au Site pour des raisons de maintenance, de mise à jour ou toute autre nécessité technique, sans obligation de préavis.</p>

			<h2>4. Propriété intellectuelle</h2>
			<p>L'ensemble du Contenu du Site (textes, graphismes, logos, icônes, images, vidéos) est la propriété exclusive d'Elias Treguier, sauf mention contraire. Toute reproduction, représentation, modification, exploitation totale ou partielle du Contenu, par quelque procédé que ce soit, est interdite sans autorisation préalable écrite de l'éditeur.</p>
			<p>Les marques, noms commerciaux et logos figurant sur le Site sont des marques déposées. Leur utilisation sans autorisation constitue une contrefaçon.</p>

			<h2>5. Données personnelles</h2>
			<p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, l'Utilisateur dispose d'un droit d'accès, de rectification, d'effacement et de portabilité de ses données personnelles, ainsi que du droit de limitation et d'opposition au traitement.</p>
			<p>Ces droits peuvent être exercés par email à : <a href="mailto:elias.treguier@gmail.com">elias.treguier@gmail.com</a>.</p>
			<p>Le Site peut collecter des données de navigation (cookies) à des fins d'analyse d'audience et d'amélioration du service. L'Utilisateur peut paramétrer ses préférences en matière de cookies via son navigateur.</p>

			<h2>6. Responsabilité</h2>
			<p>L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations publiées sur le Site, sans garantie absolue. L'Utilisateur reconnaît utiliser le Site à ses propres risques.</p>
			<p>L'éditeur ne saurait être tenu responsable des dommages directs ou indirects résultant de l'utilisation du Site, notamment en cas d'interruption, de bug, de virus, ou de présence de liens hypertextes renvoyant vers des sites tiers.</p>

			<h2>7. Liens hypertextes</h2>
			<p>Le Site peut contenir des liens vers des sites tiers. L'éditeur n'exerce aucun contrôle sur le contenu de ces sites et décline toute responsabilité quant à leur contenu, leur utilisation ou leur politique de confidentialité.</p>
			<p>La création de liens hypertextes vers le Site est autorisée sous réserve de ne pas utiliser la technique de lien profond (« deep linking ») et que le lien s'ouvre dans une nouvelle fenêtre ou un onglet du navigateur.</p>

			<h2>8. Modification des CGU</h2>
			<p>L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur le Site. L'Utilisateur est invité à consulter régulièrement cette page.</p>

			<h2>9. Droit applicable</h2>
			<p>Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>

			<h2>10. Contact</h2>
			<p>Pour toute question relative aux présentes CGU, vous pouvez contacter :<br />
			Elias Treguier — <a href="mailto:elias.treguier@gmail.com">elias.treguier@gmail.com</a></p>
		</div>
	</article>

	<footer class="legal-footer">
		<a href={resolve('/')} class="mono-alt">← Retour à l'accueil</a>
	</footer>
</section>

<style>
	.legal-page {
		max-width: 800px;
		margin-inline: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		position: relative;
		z-index: 10;
	}

	.back {
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		text-decoration: none;
	}
	.back:hover { color: var(--accent); }

	.legal-article {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
	}

	.legal-header h1 {
		margin-top: 0.3rem;
		line-height: 1.05;
	}

	.legal-meta {
		font-size: 12px;
		letter-spacing: 0.1em;
		color: var(--text-muted);
		text-transform: uppercase;
	}

	.legal-content {
		font-size: 15.5px;
		line-height: 1.75;
		color: var(--text-color);
	}
	.legal-content h2 {
		font-family: 'artistic', serif;
		font-size: 22px;
		font-weight: 700;
		color: var(--primary);
		margin: 2rem 0 0.6rem;
	}
	.legal-content h2:first-child { margin-top: 0; }
	.legal-content p {
		margin-bottom: 0.8rem;
	}
	.legal-content a {
		color: var(--accent);
		text-decoration: underline;
	}
	.legal-content a:hover {
		color: #d97a2a;
	}

	.legal-footer {
		border-top: 1px dashed #c9b894;
		padding-top: 1.5rem;
	}
	.legal-footer a {
		font-size: 13px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-muted);
	}

	@media (max-width: 640px) {
		.legal-page { padding: 1.2rem; }
		.legal-header h1 { font-size: 28px; }
		.legal-content { font-size: 14.5px; }
	}
</style>