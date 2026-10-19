-- Symios — Full database schema for Infomaniak deploy
-- Authoritative source: db/init/01-init.sql
-- Run this in phpMyAdmin or via mysql CLI on the host.
-- Table order matters: referenced tables must exist before references.

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    slug VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    subtitle VARCHAR(300) NOT NULL,
    cover_image_key VARCHAR(255) NULL,
    price DECIMAL(10,2) NOT NULL,
    details_html TEXT NULL,
    CONSTRAINT category_fk FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Better Auth tables ────────────────────────────────────
-- Must come BEFORE carts/blog_posts that reference user(id).

CREATE TABLE IF NOT EXISTS user (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    emailVerified BOOLEAN NOT NULL DEFAULT false,
    image VARCHAR(255) NULL,
    phone VARCHAR(15) NOT NULL,
    fname VARCHAR(255) NULL,
    address VARCHAR(255) NULL,
    city VARCHAR(100) NULL,
    role INT NOT NULL DEFAULT 0,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS session (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    token VARCHAR(255) NOT NULL,
    ipAddress VARCHAR(255) NULL,
    userAgent TEXT NULL,
    userId VARCHAR(36) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS account (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    accountId VARCHAR(255) NOT NULL,
    providerId VARCHAR(255) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    accessToken TEXT NULL,
    refreshToken TEXT NULL,
    idToken TEXT NULL,
    accessTokenExpiresAt TIMESTAMP NULL,
    refreshTokenExpiresAt TIMESTAMP NULL,
    scope VARCHAR(255) NULL,
    password VARCHAR(255) NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS verification (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    identifier VARCHAR(255) NOT NULL,
    value TEXT NULL,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── App tables ────────────────────────────────────────────

CREATE TABLE carts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status ENUM('cancelled', 'pending', 'completed') NOT NULL DEFAULT 'pending',
    customer_message TEXT NULL,
    photos_folder VARCHAR(255) NULL,
    delivery_date DATETIME NULL,
    stripe_session_id VARCHAR(255) NULL,
    CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE cart_items (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cart_id VARCHAR(36) NOT NULL,
    article_id INT NOT NULL,
    slices INT NOT NULL CHECK (slices >= 1),
    quantity INT NOT NULL CHECK (quantity >= 1),
    unit_price DECIMAL(10,2) NOT NULL,
    CONSTRAINT cart_items_cart_fk FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    CONSTRAINT cart_items_article_fk FOREIGN KEY (article_id) REFERENCES articles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    excerpt VARCHAR(500) NULL,
    content TEXT NULL,
    author_id VARCHAR(36) NULL,
    published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Seed categories ───────────────────────────────────────

INSERT IGNORE INTO categories (name) VALUES
    ('Abonnement'),
    ('Forfait'),
    ('À l''heure'),
    ('Formation'),
    ('Ressource');

-- ── Seed articles ──────────────────────────────────────────

INSERT INTO articles (category_id, slug, title, subtitle, cover_image_key, price, details_html)
SELECT c.id, 'agent-gere', 'Agent géré', 'Votre agent IA en production, suivi et amélioré en continu, mois après mois.', NULL, 890.00, '<ul><li>Agent IA dédié à votre activité</li><li>Hébergement souverain (Infomaniak)</li><li>Mise à jour et amélioration continue</li><li>Documentation complète incluse</li><li>Support prioritaire</li></ul>'
FROM categories c WHERE c.name = 'Abonnement'
AND NOT EXISTS (SELECT 1 FROM articles WHERE slug = 'agent-gere');

INSERT INTO articles (category_id, slug, title, subtitle, cover_image_key, price, details_html)
SELECT c.id, 'deploiement-cle-en-main', 'Déploiement clé en main', 'Un projet cadré, de l''audit à la mise en production, livré avec sa documentation.', NULL, 3500.00, '<ul><li>Audit de vos besoins</li><li>Architecture personnalisée</li><li>Développement et tests</li><li>Déploiement souverain</li><li>Documentation complète</li></ul>'
FROM categories c WHERE c.name = 'Forfait'
AND NOT EXISTS (SELECT 1 FROM articles WHERE slug = 'deploiement-cle-en-main');

INSERT INTO articles (category_id, slug, title, subtitle, cover_image_key, price, details_html)
SELECT c.id, 'expertise-a-la-demande', 'Expertise à la demande', 'Conseil, debug ou formation IA ponctuels, quand vous en avez besoin, sans engagement.', NULL, 120.00, '<ul><li>Conseil technique personnalisé</li><li>Debug et résolution de problèmes</li><li>Formation individuelle ou en groupe</li><li>Sans engagement, à l''heure</li></ul>'
FROM categories c WHERE c.name = 'À l''heure'
AND NOT EXISTS (SELECT 1 FROM articles WHERE slug = 'expertise-a-la-demande');