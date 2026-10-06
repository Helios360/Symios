<script lang="ts">
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>CGV | Symios</title>
	<meta name="description" content="Conditions Générales de Vente des prestations Symios." />
</svelte:head>

<section class="legal-page">
	<a href="{base}" class="back mono-alt">← Retour à l'accueil</a>

	<article class="legal-article">
		<header class="legal-header">
			<p class="section-index">// CGV</p>
			<h1>Conditions Générales de Vente</h1>
			<p class="legal-meta mono-alt">Dernière mise à jour : septembre 2026</p>
		</header>

		<div class="legal-content">
			<h2>1. Champ d'application</h2>
			<p>Les présentes Conditions Générales de Vente (ci-après « CGV ») s'appliquent à toutes les prestations de services proposées et vendues par Elias Treguier, Entreprise Individuelle (EI), dans le cadre de son activité d'intégrateur et de conseil en intelligence artificielle, automatisation et infrastructure numérique.</p>
			<p>Les CGV sont accessibles à tout moment sur le Site et prévaudront sur toute autre version. Le Client déclare en avoir pris connaissance et les accepter avant toute commande.</p>

			<h2>2. Prestations et tarifs</h2>
			<p>Les prestations proposées sont listées sur la page <a href="{base}/shop">Boutique</a> du Site et se répartissent en trois catégories :</p>
			<ul>
				<li><strong>Abonnements</strong> — prestations récurrentes facturées mensuellement, avec engagement minimum de 3 mois sauf mention contraire.</li>
				<li><strong>Forfaits</strong> — prestations ponctuelles cadrées, facturées au forfait, avec un périmètre défini dans la proposition commerciale.</li>
				<li><strong>Prestations à l'heure</strong> — conseil, debug ou formation facturés au temps passé, avec un devis préalable pour toute intervention estimée à plus de 2 heures.</li>
			</ul>
			<p>Les prix sont indiqués en euros (€), toutes taxes comprises (TTC). Le vendeur n'est pas assujetti à la TVA en application de l'article 293 B du CGI (franchise en base).</p>

			<h2>3. Commande et acceptation</h2>
			<p>La commande est validée lorsque le Client :</p>
			<ul>
				<li>sélectionne une ou plusieurs prestations sur le Site,</li>
				<li>renseigne ses informations de contact,</li>
				<li>valide le paiement,</li>
				<li>et accepte les présentes CGV.</li>
			</ul>
			<p>Un email de confirmation est envoyé au Client récapitulant la commande, le montant facturé et la date de début prévue de la prestation.</p>

			<h2>4. Paiement</h2>
			<p>Le règlement s'effectue par carte bancaire via le prestataire de paiement sécurisé Stripe. Les données bancaires sont traitées directement par Stripe et ne transitent ni ne sont stockées par le vendeur.</p>
			<ul>
				<li><strong>Abonnements</strong> : paiement mensuel automatique par prélèvement, débutant à la souscription.</li>
				<li><strong>Forfaits</strong> : paiement en une fois à la commande, ou en deux fois (50 % à la commande, 50 % à la livraison) sur demande écrite.</li>
				<li><strong>Prestations à l'heure</strong> : paiement après réalisation, sur facture à 30 jours.</li>
			</ul>

			<h2>5. Délais et livraison</h2>
			<p>Les délais de réalisation sont précisés dans la proposition commerciale ou la page de la prestation. Le vendeur s'engage à respecter ces délais, sous réserve de la fourniture en temps utile des informations et accès nécessaires par le Client.</p>
			<p>La « livraison » d'une prestation immatérielle (agent IA, workflow, documentation) s'entend comme la mise à disposition du livrable convenu, accompagné de sa documentation.</p>

			<h2>6. Droit de rétractation</h2>
			<p>Conformément à l'article L. 221-18 du Code de la consommation, le Client dispose d'un délai de 14 jours à compter de la conclusion du contrat pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités.</p>
			<p><strong>Exceptions :</strong> Conformément à l'article L. 221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux prestations de services pleinement exécutées avant la fin du délai de rétractation et dont l'exécution a commencé après accord préalable exprès du Client et renoncement exprès à son droit de rétractation.</p>
			<p>En pratique, toute prestation commencée avant la fin du délai de 14 jours avec l'accord écrit du Client est réputée ferme et définitive.</p>

			<h2>7. Garanties</h2>
			<p>Le vendeur s'engage à fournir des prestations conformes à la description et au cahier des charges convenu. En cas de non-conformité, le Client doit la signaler par écrit dans un délai de 7 jours suivant la livraison. Le vendeur s'engage à corriger le défaut dans les meilleurs délais.</p>
			<p>Les prestations d'abonnement incluent un suivi continu et des mises à jour correctives sans frais supplémentaires.</p>

			<h2>8. Propriété intellectuelle et licence</h2>
			<p>Le vendeur conserve l'intégralité de ses droits de propriété intellectuelle sur les outils, frameworks, bibliothèques et méthodes qu'il utilise ou développe. Le Client bénéficie d'une licence d'utilisation non exclusive, non transférable, pour la durée de la prestation ou de l'abonnement.</p>
			<p>Le code, la documentation et les livrables spécifiquement développés pour le Client peuvent être réutilisés par le vendeur, sauf clause de confidentialité spécifique signée par les deux parties.</p>

			<h2>9. Confidentialité</h2>
			<p>Chaque partie s'engage à ne pas divulguer les informations confidentielles de l'autre partie sans son consentement écrit préalable. Cette obligation survivra pendant 2 ans après la fin de la relation contractuelle.</p>

			<h2>10. Résiliation</h2>
			<ul>
				<li><strong>Abonnements</strong> : résiliation possible à tout moment par email, avec un préavis de 30 jours. Le paiement du mois en cours reste dû.</li>
				<li><strong>Forfaits</strong> : résiliation possible avant le début de la prestation (remboursement intégral). Après le début, le montant correspondant au travail déjà réalisé est acquis au vendeur.</li>
				<li><strong>Prestations à l'heure</strong> : résiliation sans frais à tout moment, seules les heures déjà effectuées sont dues.</li>
			</ul>

			<h2>11. Responsabilité</h2>
			<p>Le vendeur ne saurait être tenu responsable des dommages indirects, pertes d'exploitation, pertes de données ou préjudices immatériels, même s'il a été informé de leur éventualité. La responsabilité du vendeur est limitée au montant total des sommes versées par le Client au titre de la prestation concernée.</p>

			<h2>12. Droit applicable et litiges</h2>
			<p>Les présentes CGV sont soumises au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable avant toute action judiciaire. À défaut, les tribunaux compétents seront ceux du ressort du siège du vendeur.</p>

			<h2>13. Contact</h2>
			<p>Elias Treguier<br />
			Email : <a href="mailto:elias.treguier@gmail.com">elias.treguier@gmail.com</a></p>
		</div>
	</article>

	<footer class="legal-footer">
		<a href="{base}" class="mono-alt">← Retour à l'accueil</a>
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