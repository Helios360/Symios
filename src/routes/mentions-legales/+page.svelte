<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Mentions Légales | Symios</title>
	<meta name="description" content="Mentions légales du site Symios — Elias Treguier, EI." />
</svelte:head>

<section class="legal-page">
	<a href={resolve('/')} class="back mono-alt">← Retour à l'accueil</a>

	<article class="legal-article">
		<header class="legal-header">
			<p class="section-index">// MENTIONS LÉGALES</p>
			<h1>Mentions Légales</h1>
			<p class="legal-meta mono-alt">Dernière mise à jour : septembre 2026</p>
		</header>

		<div class="legal-content">
			<h2>1. Éditeur du site</h2>
			<p><strong>Elias Treguier</strong><br />
			Entreprise Individuelle (EI)<br />
			SIRET : 982 649 950 00019<br />
			Siège social : 9 Chemin de la Pierre, 69160 Tassin-la-Demi-Lune, France<br />
			Email : <a href="mailto:elias.treguier@gmail.com">elias.treguier@gmail.com</a><br />
			Téléphone : <a href="tel:+33628783585">06 28 78 35 85</a></p>
			<p>Le vendeur n'est pas assujetti à la TVA en application de l'article 293 B du Code Général des Impôts (franchise en base).</p>

			<h2>2. Directeur de la publication</h2>
			<p>Elias Treguier</p>

			<h2>3. Hébergement</h2>
			<p>Le Site est hébergé sur une infrastructure personnelle gérée par Elias Treguier, chez Infomaniak Network SA — Rue Eugène-Marziano 25, 1227 Les Acacias, Suisse.</p>
			<p>Les noms de domaine sont gérés par OVH — 2 Rue Kellermann, 59100 Roubaix, France.</p>

			<h2>4. Activité</h2>
			<p>Elias Treguier exerce une activité de conseil, intégration, développement et hébergement de solutions d'intelligence artificielle, d'automatisation et d'infrastructure numérique, à destination des entreprises et des professionnels.</p>
			<p>Code APE (NAF) : 6201Z — Programmation informatique<br />
			Numéro de TVA intracommunautaire : non applicable (franchise en base)</p>

			<h2>5. Propriété intellectuelle</h2>
			<p>L'ensemble du contenu du Site (textes, graphismes, logos, icônes) est la propriété exclusive d'Elias Treguier, sauf indication contraire. Toute reproduction ou représentation, totale ou partielle, sans autorisation préalable est interdite.</p>

			<h2>6. Protection des données personnelles</h2>
			<p>Conformément au Règlement Général sur la Protection des Données (RGPD — Règlement UE 2016/679) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée :</p>
			<ul>
				<li><strong>Responsable de traitement</strong> : Elias Treguier</li>
				<li><strong>Finalités</strong> : gestion des commandes, relation client, envoi d'informations commerciales (avec consentement préalable), amélioration du service.</li>
				<li><strong>Données collectées</strong> : nom, email, téléphone, adresse (le cas échéant), données de navigation (cookies analytiques).</li>
				<li><strong>Durée de conservation</strong> : 3 ans après le dernier contact pour les données clients, 13 mois pour les cookies.</li>
				<li><strong>Droits</strong> : accès, rectification, effacement, portabilité, limitation et opposition. Ces droits s'exercent par email à <a href="mailto:elias.treguier@gmail.com">elias.treguier@gmail.com</a>.</li>
			</ul>
			<p>Aucune donnée n'est transférée hors de l'Union Européenne. En cas de sous-traitance (Stripe pour le paiement, hébergement), les garanties contractuelles imposent le respect du RGPD.</p>

			<h2>7. Cookies</h2>
			<p>Le Site peut utiliser des cookies de navigation à des fins d'analyse d'audience et d'amélioration de l'expérience utilisateur. L'Utilisateur peut à tout moment paramétrer ses préférences via les options de son navigateur.</p>
			<p>Les cookies suivants peuvent être utilisés :</p>
			<ul>
				<li><strong>Cookies techniques</strong> — nécessaires au fonctionnement du Site (session, panier).</li>
				<li><strong>Cookies analytiques</strong> — anonymisés, destinés à mesurer l'audience (durée : 13 mois).</li>
			</ul>

			<h2>8. Médiation</h2>
			<p>Conformément aux articles L. 611-1 et suivants du Code de la consommation, le Client peut recourir gratuitement à un médiateur de la consommation en cas de litige :</p>
			<p>CNPM — Médiation de la Consommation<br />
			Site : <a href="https://www.cnpm-mediation-consommation.eu" target="_blank" rel="noopener noreferrer">www.cnpm-mediation-consommation.eu</a></p>

			<h2>9. Contact</h2>
			<p>Pour toute demande d'information ou réclamation :<br />
			Elias Treguier — <a href="mailto:elias.treguier@gmail.com">elias.treguier@gmail.com</a><br />
			<a href="tel:+33628783585">06 28 78 35 85</a></p>
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
		font-family: 'Monoton', sans-serif;
		font-size: 22px;
		font-weight: 700;
		color: var(--primary);
		margin: 2rem 0 0.6rem;
	}
	.legal-content h2:first-child { margin-top: 0; }
	.legal-content p {
		margin-bottom: 0.8rem;
	}
	.legal-content ul {
		padding-left: 1.5rem;
		margin-bottom: 0.8rem;
		list-style: disc;
	}
	.legal-content li {
		margin-bottom: 0.3rem;
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