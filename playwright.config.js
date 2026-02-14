// @ts-check
import {defineConfig, devices} from '@playwright/test';
const path = require('path');

export default defineConfig({
	testDir: './tests',
	testMatch: '**/*-spec.js',
	testIgnore: '**/utils/**',
	snapshotPathTemplate: './tests/result/reference/{projectName}/{platform}/{arg}{ext}',
	expect: {
		toHaveScreenshot: {
			pathTemplate: './tests/result/reference/{projectName}/{platform}/{arg}{ext}'
		}
	},
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Set it to 1 because there is a bug that does not create a reference. */
	workers: 1,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [
		['html', {
			outputFolder: path.join(__dirname, './tests/result/reports/html')
		}]
	],
	// Playwright-report output path
	outputDir: path.join(__dirname, './tests/result/test-result'),
	use: {
		trace: 'on-first-retry'
	},
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
				channel: 'chrome'
			}
		}
	]
});
