-- Seed: 3 offres affichées sur la landing (modules Symios).
-- Idempotent : les colonnes UNIQUE (categories.name, articles.slug) évitent les
-- doublons si le script est rejoué manuellement.

INSERT IGNORE INTO categories (name) VALUES
    ('Abonnement'),
    ('Forfait'),
    ('À l''heure');

INSERT IGNORE INTO articles (category_id, slug, title, subtitle, cover_image_key, price, details_html) VALUES
    (
        (SELECT id FROM categories WHERE name = 'Abonnement'),
        'agent-gere',
        'Agent géré',
        'Votre agent IA en production, suivi et amélioré en continu, mois après mois.',
        NULL,
        890.00,
        '<ul><li>supervision &amp; monitoring</li><li>mises à jour modèles</li><li>support prioritaire</li></ul>'
    ),
    (
        (SELECT id FROM categories WHERE name = 'Forfait'),
        'deploiement-cle-en-main',
        'Déploiement clé en main',
        'Un projet cadré, de l''audit à la mise en production, livré avec sa documentation.',
        NULL,
        3500.00,
        '<ul><li>audit &amp; cadrage</li><li>intégration sur-mesure</li><li>docs + passation</li></ul>'
    ),
    (
        (SELECT id FROM categories WHERE name = 'À l''heure'),
        'expertise-a-la-demande',
        'Expertise à la demande',
        'Conseil, debug ou formation IA ponctuels, quand vous en avez besoin, sans engagement.',
        NULL,
        120.00,
        '<ul><li>conseil &amp; architecture</li><li>debug &amp; optimisation</li><li>formation équipe</li></ul>'
    );
