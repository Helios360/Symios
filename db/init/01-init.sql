CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);
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
);

-- Better Auth tables (user, session, account, verification)
-- Must come BEFORE carts/auth tables that reference user(id).

-- L'utilisateur applicatif peut ne pas exister (conteneur CI frais avec un
-- autre MYSQL_USER) : CREATE IF NOT EXISTS puis ALTER rendent le script
-- idempotent, en local comme en CI.
CREATE USER IF NOT EXISTS 'symios'@'%' IDENTIFIED WITH caching_sha2_password BY 'symios';
ALTER USER 'symios'@'%' IDENTIFIED WITH caching_sha2_password BY 'symios';
FLUSH PRIVILEGES;

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
);

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
);

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
);

CREATE TABLE IF NOT EXISTS verification (
    id VARCHAR(36) PRIMARY KEY NOT NULL,
    identifier VARCHAR(255) NOT NULL,
    value TEXT NULL,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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
);
CREATE TABLE cart_items (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cart_id VARCHAR(36) NOT NULL,
    article_id INT NOT NULL,
    slices INT NOT NULL CHECK (slices >= 1),
    quantity INT NOT NULL CHECK (quantity >= 1),
    unit_price DECIMAL(10,2) NOT NULL,
    CONSTRAINT cart_items_cart_fk FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    CONSTRAINT cart_items_article_fk FOREIGN KEY (article_id) REFERENCES articles(id)
);

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
);