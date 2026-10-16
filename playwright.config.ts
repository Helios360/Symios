import { defineConfig, devices } from '@playwright/test';

/**
 * Configuration Playwright — tests end-to-end.
 * Lancer avec : npm run test:e2e  (dev server démarré automatiquement sur :5173)
 */
export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? 'github' : 'html',

	use: {
		baseURL: 'http://localhost:5173',
		trace: 'on-first-retry'
	},

	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	],

	webServer: {
		command: 'npm run dev',
		port: 5173,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000
	}
});