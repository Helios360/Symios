import nodemailer from 'nodemailer';
import { building } from '$app/environment';
import { env } from '$env/dynamic/private';

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