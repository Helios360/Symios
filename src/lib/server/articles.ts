import { pool } from './db';

export type Article = {
	id: number;
	slug: string;
	title: string;
	subtitle: string;
	cover: string | null;
	price: number;
	category: string;
	categoryKey: string;
	features: string[];
};

/** Catégories connues → clé de thème (couleur d'en-tête de carte, gérée en CSS global). */
const CATEGORY_KEYS: Record<string, string> = {
	abonnement: 'abonnement',
	forfait: 'forfait',
	'a l heure': 'heures',
	heures: 'heures',
	formation: 'formation',
	ressource: 'ressource'
};

function normalize(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();
}

/** Extrait le texte des <li> d'un bloc details_html pour la ligne « caractéristiques ». */
function extractFeatures(html: string | null): string[] {
	if (!html) return [];
	return [...html.matchAll(/<li[^>]*>(.*?)<\/li>/gis)].map((m) =>
		m[1]
			.replace(/<[^>]+>/g, '')
			.replace(/&amp;/g, '&')
			.replace(/\s+/g, ' ')
			.trim()
	);
}

/** Charge les articles mis en forme. `limit` optionnel pour un showcase. */
export async function getArticles(limit?: number): Promise<Article[]> {
	const [rows] = await pool.query(
		`
		SELECT a.id, a.slug, a.title, a.subtitle, a.cover_image_key, a.price, a.details_html,
		       c.name AS category_name
		FROM articles a
		LEFT JOIN categories c ON c.id = a.category_id
		ORDER BY a.id ASC
		${limit ? 'LIMIT ?' : ''}
		`,
		limit ? [limit] : []
	);

	return (rows as any[]).map((row) => {
		const categoryName: string = row.category_name ?? 'Ressource';
		return {
			id: row.id as number,
			slug: row.slug as string,
			title: row.title as string,
			subtitle: row.subtitle as string,
			cover: row.cover_image_key as string | null,
			price: Number(row.price),
			category: categoryName,
			categoryKey: CATEGORY_KEYS[normalize(categoryName)] ?? 'ressource',
			features: extractFeatures(row.details_html)
		};
	});
}
