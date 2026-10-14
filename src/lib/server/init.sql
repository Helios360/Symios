-- Symios — Full database schema
-- Run this on Infomaniak phpMyAdmin or via mysql CLI.
-- better-auth manages the auth tables but we create them explicitly here.

-- ── better-auth tables ────────────────────────────────────

CREATE TABLE IF NOT EXISTS user (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    emailVerified INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- custom fields defined in src/lib/server/auth.ts
    phone TEXT,
    fname TEXT,
    address TEXT,
    city TEXT,
    role INTEGER DEFAULT 0,
    UNIQUE KEY email_unique (email(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    expiresAt TIMESTAMP NOT NULL,
    token TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ipAddress TEXT,
    userAgent TEXT,
    userId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS account (
    id TEXT NOT NULL PRIMARY KEY,
    accountId TEXT NOT NULL,
    providerId TEXT NOT NULL,
    userId TEXT NOT NULL,
    accessToken TEXT,
    refreshToken TEXT,
    idToken TEXT,
    accessTokenExpiresAt TIMESTAMP NULL,
    refreshTokenExpiresAt TIMESTAMP NULL,
    scope TEXT,
    password TEXT,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS verification (
    id TEXT NOT NULL PRIMARY KEY,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── App tables ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL DEFAULT '',
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    category_id INT NOT NULL,
    cover_image_key VARCHAR(255) DEFAULT NULL,
    details_html TEXT DEFAULT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY slug_unique (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS carts (
    id VARCHAR(36) PRIMARY KEY,
    user_id TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status ENUM('cancelled', 'pending', 'completed') NOT NULL DEFAULT 'pending',
    customer_message TEXT,
    photos_folder VARCHAR(255) DEFAULT NULL,
    delivery_date DATETIME DEFAULT NULL,
    stripe_session_id VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id VARCHAR(36) NOT NULL,
    article_id INT NOT NULL,
    slices INT NOT NULL DEFAULT 1,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS blog_posts (
    id VARCHAR(36) PRIMARY KEY,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    author_id TEXT,
    published TINYINT(1) NOT NULL DEFAULT 0,
    published_at DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE SET NULL,
    UNIQUE KEY slug_unique_blog (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Seed categories ───────────────────────────────────────

INSERT IGNORE INTO categories (id, name) VALUES
    (1, 'Abonnement'),
    (2, 'Forfait'),
    (3, 'À l heure'),
    (4, 'Formation'),
    (5, 'Ressource');