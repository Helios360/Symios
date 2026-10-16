import { test, expect } from '@playwright/test';

test('la page d’accueil se charge', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/Symios/);
	await expect(page.getByRole('link', { name: 'contact' })).toBeVisible();
});

test('le bandeau de consentement cookies apparaît au premier accès', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('dialog', { name: /cookies/i })).toBeVisible();
});

test('le bandeau cookies disparaît après acceptation', async ({ page }) => {
	await page.goto('/');

	const banner = page.getByRole('dialog', { name: /cookies/i });
	await expect(banner).toBeVisible();

	await banner.getByRole('button', { name: 'Accepter' }).click();

	await expect(banner).toBeHidden();

	const stored = await page.evaluate(() => localStorage.getItem('cookies_accepted'));
	expect(stored).toBe('accepted');
});