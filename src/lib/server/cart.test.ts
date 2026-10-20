import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { randomUUID } from 'node:crypto';
import { pool } from './db';
import {
	getActiveCart,
	addItem,
	removeItem,
	cartItemCount,
	attachStripeSession,
	confirmStripePayment,
	getCartHistory
} from './cart';

/**
 * Tests d'intégration du panier — nécessitent une base MySQL réelle
 * (DATABASE_URL du .env.test en local, service mysql dans la CI).
 * Chaque exécution crée un utilisateur dédié puis nettoie ses données.
 */

const userId = randomUUID();
const userEmail = `${userId}@symios.test`;
const articleId = 1;

async function seedArticle() {
	const [rows] = await pool.query(
		`INSERT IGNORE INTO articles (id, title, slug, price, category_id)
		 SELECT 1, 'Article test', 'article-test', 12.50, id FROM categories LIMIT 1`
	);
	return rows;
}

async function articlePrice() {
	const [rows] = await pool.query('SELECT price FROM articles WHERE id = ?', [articleId]);
	return Number((rows as any[])[0]?.price ?? 0);
}

beforeAll(async () => {
	await pool.query(
		`INSERT INTO user (id, name, email, emailVerified, phone) VALUES (?, 'Test User', ?, true, '0000000000')`,
		[userId, userEmail]
	);
	await seedArticle();
});

afterAll(async () => {
	// Nettoyage : lignes du panier, paniers, puis utilisateur de test.
	const [carts] = await pool.query('SELECT id FROM carts WHERE user_id = ?', [userId]);
	const ids = (carts as any[]).map((c) => c.id);
	if (ids.length) {
		await pool.query(`DELETE FROM cart_items WHERE cart_id IN (${ids.map(() => '?').join(',')})`, ids);
		await pool.query(`DELETE FROM carts WHERE user_id = ?`, [userId]);
	}
	await pool.query('DELETE FROM user WHERE id = ?', [userId]);
	await pool.end();
});

describe('panier (cart.ts)', () => {
	it('getActiveCart renvoie null sans panier en cours', async () => {
		expect(await getActiveCart(userId)).toBeNull();
	});

	it('addItem crée un panier pending et ajoute la ligne', async () => {
		const cart = await addItem(userId, articleId, 1);
		expect(cart).not.toBeNull();
		expect(cart!.status).toBe('pending');
		expect(cart!.items).toHaveLength(1);
		expect(cart!.items[0].quantity).toBe(1);
		expect(Number(cart!.items[0].unit_price)).toBeCloseTo(await articlePrice(), 2);
	});

	it('addItem incrémente la ligne existante (même article/slices)', async () => {
		const cart = await addItem(userId, articleId, 1);
		const line = cart!.items.find((i) => i.article_id === articleId);
		expect(line?.quantity).toBe(2);
		expect(Number(line!.unit_price)).toBeCloseTo(2 * (await articlePrice()), 2);
	});

	it('cartItemCount totalise les quantités', async () => {
		expect(await cartItemCount(userId)).toBe(2);
	});

	it('removeItem décrémente puis supprime la ligne à zéro', async () => {
		let cart = await removeItem(userId, (await getActiveCart(userId))!.items[0].id);
		expect(cart!.items[0].quantity).toBe(1);

		cart = await removeItem(userId, cart!.items[0].id);
		expect(cart!.items).toHaveLength(0);
	});

	it('attachStripeSession puis confirmStripePayment : pending → completed, idempotent', async () => {
		const cart = await addItem(userId, articleId, 1);
		const sessionId = `cs_test_${randomUUID()}`;
		await attachStripeSession(userId, sessionId);

		const confirmed = await confirmStripePayment(sessionId);
		expect(confirmed).toBe(cart!.id);

		// Déjà traité : ne renvoie rien, ne casse pas.
		expect(await confirmStripePayment(sessionId)).toBeNull();

		const [rows] = await pool.query('SELECT status FROM carts WHERE id = ?', [cart!.id]);
		expect((rows as any[])[0].status).toBe('completed');

		// Le panier validé rejoint l'historique.
		const history = await getCartHistory(userId);
		expect(history.some((h) => h.id === cart!.id)).toBe(true);
	});
});