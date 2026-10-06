import { randomUUID } from 'node:crypto';
import { pool } from './db';

/**
 * Logique de panier — réservée aux utilisateurs authentifiés.
 *
 * Un utilisateur possède au plus un panier `pending` (le panier « en cours »).
 * Une fois payé via Stripe il passe en `completed` (ou `cancelled`) et rejoint
 * l'historique. `cart_items.unit_price` stocke le total de la ligne
 * (quantité × parts × prix de l'article).
 */

export type CartStatus = 'pending' | 'completed' | 'cancelled';

export type CartItem = {
	id: number;
	article_id: number;
	slices: number;
	quantity: number;
	unit_price: number;
	title: string | null;
	slug: string | null;
	price: number | null;
};

export type Cart = {
	id: string;
	user_id: string;
	created_at: string;
	total_amount: number;
	status: CartStatus;
	delivery_date: string | null;
	customer_message: string | null;
	stripe_session_id: string | null;
	items: CartItem[];
	total: number;
};

/** Charge les lignes d'un panier, jointes aux infos article. */
async function loadItems(cartId: string): Promise<CartItem[]> {
	const [rows] = await pool.query(
		`
		SELECT ci.id, ci.article_id, ci.slices, ci.quantity, ci.unit_price,
		       a.title, a.slug, a.price
		FROM cart_items ci
		LEFT JOIN articles a ON a.id = ci.article_id
		WHERE ci.cart_id = ?
		ORDER BY ci.id DESC
		`,
		[cartId]
	);
	return (rows as any[]).map((r) => ({
		id: Number(r.id),
		article_id: Number(r.article_id),
		slices: Number(r.slices),
		quantity: Number(r.quantity),
		unit_price: Number(r.unit_price),
		title: r.title ?? null,
		slug: r.slug ?? null,
		price: r.price == null ? null : Number(r.price)
	}));
}

function hydrate(row: any, items: CartItem[]): Cart {
	return {
		id: row.id,
		user_id: row.user_id,
		created_at: row.created_at,
		total_amount: Number(row.total_amount),
		status: row.status,
		delivery_date: row.delivery_date ?? null,
		customer_message: row.customer_message ?? null,
		stripe_session_id: row.stripe_session_id ?? null,
		items,
		total: items.reduce((sum, it) => sum + it.unit_price, 0)
	};
}

/** Panier `pending` de l'utilisateur (avec ses lignes), ou `null`. */
export async function getActiveCart(userId: string): Promise<Cart | null> {
	const [rows] = await pool.query(
		`SELECT * FROM carts WHERE user_id = ? AND status = 'pending' LIMIT 1`,
		[userId]
	);
	const row = (rows as any[])[0];
	if (!row) return null;
	return hydrate(row, await loadItems(row.id));
}

/** Renvoie l'id du panier `pending` de l'utilisateur, en le créant au besoin. */
async function getOrCreateActiveCartId(userId: string): Promise<string> {
	const [rows] = await pool.query(
		`SELECT id FROM carts WHERE user_id = ? AND status = 'pending' LIMIT 1`,
		[userId]
	);
	const existing = (rows as any[])[0];
	if (existing) return existing.id as string;

	const id = randomUUID();
	await pool.query(`INSERT INTO carts (id, user_id, status) VALUES (?, ?, 'pending')`, [id, userId]);
	return id;
}

/** Ajoute un article (incrémente la ligne existante si même article/parts). */
export async function addItem(
	userId: string,
	articleId: number,
	slices = 1
): Promise<Cart | null> {
	const [articleRows] = await pool.query(`SELECT id FROM articles WHERE id = ? LIMIT 1`, [articleId]);
	if (!(articleRows as any[])[0]) throw new Error('Article introuvable');

	const cartId = await getOrCreateActiveCartId(userId);

	const [existingRows] = await pool.query(
		`SELECT id FROM cart_items WHERE cart_id = ? AND article_id = ? AND slices = ? LIMIT 1`,
		[cartId, articleId, slices]
	);
	const existing = (existingRows as any[])[0];

	if (existing) {
		await pool.query(
			`
			UPDATE cart_items
			SET quantity = quantity + 1,
			    unit_price = (quantity + 1) * (slices * (SELECT price FROM articles WHERE id = article_id))
			WHERE id = ?
			`,
			[existing.id]
		);
	} else {
		await pool.query(
			`
			INSERT INTO cart_items (cart_id, article_id, slices, quantity, unit_price)
			VALUES (?, ?, ?, 1, 1 * (? * (SELECT price FROM articles WHERE id = ?)))
			`,
			[cartId, articleId, slices, slices, articleId]
		);
	}
	return getActiveCart(userId);
}

/** Retire une ligne du panier en cours (décrémente, puis supprime à 0). */
export async function removeItem(userId: string, itemId: number): Promise<Cart | null> {
	const [rows] = await pool.query(
		`
		SELECT ci.id, ci.quantity
		FROM cart_items ci
		JOIN carts c ON c.id = ci.cart_id
		WHERE ci.id = ? AND c.user_id = ? AND c.status = 'pending'
		LIMIT 1
		`,
		[itemId, userId]
	);
	const item = (rows as any[])[0];
	if (!item) return getActiveCart(userId);

	if (item.quantity > 1) {
		await pool.query(
			`
			UPDATE cart_items
			SET quantity = quantity - 1,
			    unit_price = (quantity - 1) * (slices * (SELECT price FROM articles WHERE id = article_id))
			WHERE id = ?
			`,
			[item.id]
		);
	} else {
		await pool.query(`DELETE FROM cart_items WHERE id = ?`, [item.id]);
	}
	return getActiveCart(userId);
}

/** Vide entièrement le panier en cours. */
export async function clearActiveCart(userId: string): Promise<void> {
	await pool.query(
		`
		DELETE ci FROM cart_items ci
		JOIN carts c ON c.id = ci.cart_id
		WHERE c.user_id = ? AND c.status = 'pending'
		`,
		[userId]
	);
}

/**
 * Met à jour les infos de livraison sur le panier en cours.
 */
export async function setDeliveryInfo(
	userId: string,
	deliveryDate: string | null,
	customerMessage: string | null
): Promise<void> {
	await pool.query(
		`UPDATE carts SET delivery_date = ?, customer_message = ? WHERE user_id = ? AND status = 'pending'`,
		[deliveryDate, customerMessage, userId]
	);
}

/**
 * Associe un Stripe Checkout Session ID au panier en cours, avant de rediriger
 * l'utilisateur vers Stripe.
 */
export async function attachStripeSession(
	userId: string,
	stripeSessionId: string
): Promise<void> {
	await pool.query(
		`UPDATE carts SET stripe_session_id = ? WHERE user_id = ? AND status = 'pending'`,
		[stripeSessionId, userId]
	);
}

/**
 * Valide le panier Stripe (appelé par le webhook après paiement réussi).
 * Fige le total et le passe en `completed`.
 * Renvoie l'id du panier validé, ou `null` s'il n'a pas été trouvé.
 */
export async function confirmStripePayment(stripeSessionId: string): Promise<string | null> {
	const cart = await getCartByStripeSession(stripeSessionId);
	if (!cart || cart.status !== 'pending') return null;

	await pool.query(
		`UPDATE carts SET total_amount = ?, status = 'completed' WHERE id = ?`,
		[cart.total, cart.id]
	);
	return cart.id;
}

/** Charge un panier via son stripe_session_id. */
async function getCartByStripeSession(stripeSessionId: string): Promise<Cart | null> {
	const [rows] = await pool.query(
		`SELECT * FROM carts WHERE stripe_session_id = ? LIMIT 1`,
		[stripeSessionId]
	);
	const row = (rows as any[])[0];
	if (!row) return null;
	return hydrate(row, await loadItems(row.id));
}

/** Historique : paniers validés/annulés de l'utilisateur, avec leurs lignes. */
export async function getCartHistory(userId: string): Promise<Cart[]> {
	const [rows] = await pool.query(
		`
		SELECT * FROM carts
		WHERE user_id = ? AND status <> 'pending'
		ORDER BY created_at DESC
		`,
		[userId]
	);
	const carts = rows as any[];
	return Promise.all(carts.map(async (row) => hydrate(row, await loadItems(row.id))));
}

/** Nombre total d'articles dans le panier en cours (pour les badges). */
export async function cartItemCount(userId: string): Promise<number> {
	const [rows] = await pool.query(
		`
		SELECT COALESCE(SUM(ci.quantity), 0) AS count
		FROM carts c
		LEFT JOIN cart_items ci ON ci.cart_id = c.id
		WHERE c.user_id = ? AND c.status = 'pending'
		`,
		[userId]
	);
	return Number((rows as any[])[0]?.count ?? 0);
}
