import nodemailer from 'nodemailer';
import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
import { pool } from './db';
import type { Cart } from './cart';

let _transport: ReturnType<typeof createTransport>;

function getTransport() {
	if (_transport === undefined) {
		_transport = building ? null : createTransport();
	}
	return _transport;
}

function createTransport() {
	const host = env.SMTP_HOST;
	const user = env.SMTP_USER;
	const pass = env.SMTP_PASS;
	if (!host || !user || !pass) {
		console.warn('[email] SMTP not configured — emails will be logged only.');
		return null;
	}
	const port = Number(env.SMTP_PORT) || 465;
	return nodemailer.createTransport({
		host, port, secure: port === 465,
		auth: { user, pass }
	});
}

export interface EmailOptions {
	to: string;
	subject: string;
	text: string;
	html?: string;
	replyTo?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ sent: true } | { sent: false; reason: string }> {
	const transport = getTransport();
	if (!transport) {
		console.log('[email] (SMTP not configured) Would send:', { to: options.to, subject: options.subject, text: options.text.slice(0, 200) });
		return { sent: false, reason: 'SMTP not configured' };
	}
	try {
		const from = env.SMTP_FROM || env.SMTP_USER || 'noreply@symios.fr';
		await transport.sendMail({ from: `"Symios" <${from}>`, to: options.to, subject: options.subject, text: options.text, html: options.html || undefined, replyTo: options.replyTo });
		return { sent: true };
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : String(err);
		console.error('[email] Send failed:', msg);
		return { sent: false, reason: msg };
	}
}

export async function notifyRgpdRequest(details: { userId: string; email: string; type: string; message: string }): Promise<void> {
	const labels: Record<string, string> = { acces: 'Acces aux donnees', suppression: 'Suppression du compte', autre: 'Autre demande' };
	const subject = `[RGPD] ${labels[details.type] || details.type} — ${details.email}`;
	const text = [
		'Nouvelle demande RGPD recue sur Symios', '',
		'Utilisateur : ' + details.userId,
		'Email : ' + details.email,
		'Type : ' + (labels[details.type] || details.type),
		'Message : ' + (details.message || '(aucun)'),
		'Date : ' + new Date().toISOString(), '',
		'Action requise : traiter sous 30 jours maximum.'
	].join('\n');
	const r = await sendEmail({ to: 'elias.treguier@gmail.com', subject, text, replyTo: details.email });
	if (!r.sent) console.log('[RGPD] Notification non envoyee:', details);
}

export async function confirmRgpdRequest(to: string): Promise<void> {
	await sendEmail({
		to,
		subject: 'Confirmation de votre demande RGPD — Symios',
		text: [
			'Bonjour,', '',
			'Nous avons bien recu votre demande concernant vos donnees personnelles.', '',
			'Conformement au RGPD, nous traiterons votre demande sous 30 jours maximum.', '',
			'Cordialement,',
			'Elias Treguier — Symios'
		].join('\n')
	});
}

function formatFrDate(value: string): string {
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return value;
	return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

function orderLines(cart: Cart): string[] {
	return cart.items.map((it) => {
		const parts = it.slices > 1 ? ` (${it.slices} parts)` : '';
		return `— ${it.title ?? 'Article'} × ${it.quantity}${parts} : ${euro.format(it.unit_price)}`;
	});
}

function orderBody(cart: Cart, name: string): string {
	const lines: string[] = [
		name ? `Bonjour ${name},` : 'Bonjour,',
		'',
		'Votre commande Symios est confirmée — merci !',
		'',
		'Récapitulatif :',
		...orderLines(cart),
		'',
		`Total : ${euro.format(cart.total)}`
	];
	if (cart.delivery_date) lines.push('', `Livraison souhaitée : ${formatFrDate(cart.delivery_date)}`);
	if (cart.customer_message) lines.push('', `Votre message : « ${cart.customer_message} »`);
	lines.push('', 'Vous pouvez suivre vos commandes dans votre espace client.', '', 'À très vite,', 'Elias Treguier — Symios');
	return lines.join('\n');
}

function orderHtml(cart: Cart, name: string): string {
	const items = cart.items
		.map((it) => {
			const parts = it.slices > 1 ? ` <span style="color:#8a7a5c;">(${it.slices} parts)</span>` : '';
			return `<li style="padding:6px 0;border-bottom:1px solid #e8e0d2;">${it.title ?? 'Article'} × ${it.quantity}${parts} <span style="font-weight:600;color:#6b5d3e;">${euro.format(it.unit_price)}</span></li>`;
		})
		.join('');
	const delivery = cart.delivery_date ? `<p style="margin:4px 0;">Livraison souhaitée : <strong>${formatFrDate(cart.delivery_date)}</strong></p>` : '';
	const message = cart.customer_message ? `<p style="margin:4px 0;">Votre message : <em>« ${cart.customer_message} »</em></p>` : '';
	return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#2b2118;">
	<h2 style="color:#6b5d3e;">Votre commande Symios est confirmée</h2>
	<p>${name ? `Bonjour ${name},` : 'Bonjour,'}</p>
	<p>Merci pour votre confiance — voici le récapitulatif :</p>
	<ul style="list-style:none;padding:0;border-top:1px solid #e8e0d2;">${items}</ul>
	<p style="font-size:18px;font-weight:700;color:#6b5d3e;">Total : ${euro.format(cart.total)}</p>
	${delivery}${message}
	<p>Vous pouvez suivre vos commandes dans votre espace client.</p>
	<p>À très vite,<br>Elias Treguier — Symios</p>
</div>`;
}

/**
 * Email de confirmation de commande, envoyé une seule fois au moment où le
 * panier passe de `pending` à `completed` (webhook Stripe ou page de succès).
 */
export async function sendOrderConfirmationEmail(cart: Cart): Promise<void> {
	const [rows] = await pool.query(`SELECT email, name, fname FROM user WHERE id = ? LIMIT 1`, [cart.user_id]);
	const user = (rows as any[])[0];
	if (!user?.email) {
		console.warn('[email] Commande confirmée mais email utilisateur introuvable — pas d\'envoi.');
		return;
	}
	const name = (user.fname || user.name || '').trim();
	const r = await sendEmail({
		to: user.email,
		subject: `Commande confirmée — ${euro.format(cart.total)} — Symios`,
		text: orderBody(cart, name),
		html: orderHtml(cart, name)
	});
	if (!r.sent) console.log('[email] Confirmation de commande non envoyée:', r.reason);
}