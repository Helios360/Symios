import nodemailer from 'nodemailer';
import { building } from '$app/environment';

// ── Env vars ──────────────────────────────────────────────
// These are loaded via $env/static/private at import time.
// During `vite build` (building === true), env vars may not
// be available, so we defer the transport creation.
const LOAD_TRANSPORT = () => {
	const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } =
		process.env as Record<string, string | undefined>;

	if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
		console.warn('[email] SMTP not configured — emails will be logged only.');
		return null;
	}

	return nodemailer.createTransport({
		host: SMTP_HOST,
		port: Number(SMTP_PORT) || 465,
		secure: (Number(SMTP_PORT) || 465) === 465, // true for 465, false for others
		auth: { user: SMTP_USER, pass: SMTP_PASS }
	});
};

// Lazy transport — created on first use, never during build.
let _transport: ReturnType<typeof LOAD_TRANSPORT> | undefined;

function getTransport() {
	if (_transport === undefined) {
		_transport = building ? null : LOAD_TRANSPORT();
	}
	return _transport;
}

// ── Types ─────────────────────────────────────────────────
export interface EmailOptions {
	to: string;
	subject: string;
	text: string;
	html?: string;
	replyTo?: string;
}

// ── Public helpers ────────────────────────────────────────

/**
 * Send an email via SMTP, or log it when SMTP is not configured.
 * Returns `{ sent: true }` on success, `{ sent: false, reason }` on failure.
 */
export async function sendEmail(options: EmailOptions): Promise<{ sent: true } | { sent: false; reason: string }> {
	const transport = getTransport();

	if (!transport) {
		console.log('[email] (SMTP not configured) Would send:', {
			to: options.to,
			subject: options.subject,
			text: options.text.slice(0, 200)
		});
		return { sent: false, reason: 'SMTP not configured' };
	}

	try {
		const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@symios.fr';
		await transport.sendMail({
			from: `"Symios" <${from}>`,
			to: options.to,
			subject: options.subject,
			text: options.text,
			html: options.html || undefined,
			replyTo: options.replyTo
		});
		return { sent: true };
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : String(err);
		console.error('[email] Send failed:', message);
		return { sent: false, reason: message };
	}
}

/**
 * Notify the site owner about a new RGPD data request.
 */
export async function notifyRgpdRequest(details: {
	userId: string;
	email: string;
	type: string;
	message: string;
}): Promise<void> {
	const typeLabels: Record<string, string> = {
		acces: 'Accès aux données',
		suppression: 'Suppression du compte',
		autre: 'Autre demande'
	};

	const subject = `[RGPD] ${typeLabels[details.type] || details.type} — ${details.email}`;
	const text = [
		`Nouvelle demande RGPD reçue sur Symios`,
		``,
		`Utilisateur : ${details.userId}`,
		`Email : ${details.email}`,
		`Type : ${typeLabels[details.type] || details.type}`,
		`Message : ${details.message || '(aucun)'}`,
		`Date : ${new Date().toISOString()}`,
		``,
		`Action requise : traiter sous 30 jours maximum.`
	].join('\n');

	// Send to the site owner
	const result = await sendEmail({
		to: 'elias.treguier@gmail.com',
		subject,
		text,
		replyTo: details.email
	});
	
	if (!result.sent) {
		// Fallback: log the request so it's not lost
		console.log('[RGPD] Notification non envoyée — données conservées:', details);
	}
}

/**
 * Send a confirmation to the user who submitted an RGPD request.
 */
export async function confirmRgpdRequest(to: string): Promise<void> {
	const result = await sendEmail({
		to,
		subject: 'Confirmation de votre demande RGPD — Symios',
		text: [
			`Bonjour,`,
			``,
			`Nous avons bien reçu votre demande concernant vos données personnelles.`,
			``,
			`Conformément au Règlement Général sur la Protection des Données (RGPD),`,
			`nous traiterons votre demande sous un maximum de 30 jours.`,
			``,
			`Si vous avez des questions, vous pouvez répondre à cet email.`,
			``,
			`Cordialement,`,
			`Elias Treguier — Symios`
		].join('\n'),
		html: [
			'<p><strong>Bonjour,</strong></p>',
			'<p>Nous avons bien reçu votre demande concernant vos données personnelles.</p>',
			'<p>Conformément au Règlement Général sur la Protection des Données (RGPD),',
			'nous traiterons votre demande sous un maximum de <strong>30 jours</strong>.</p>',
			'<p>Si vous avez des questions, vous pouvez répondre à cet email.</p>',
			'<p>Cordialement,<br>Elias Treguier — Symios</p>'
		].join('\n')
	});
}