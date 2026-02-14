// @ts-check
import {test, expect} from '@playwright/test';

import {setupViewport} from '../utils/test-utils';

import * as token from '../../packages/web-tokens/json/typography-semantic.json'

test('typography semantic tokens HTML renders and matches screenshot', async ({page}) => {
	setupViewport(page, token, 1280, 'Typography semantic tokens for web');
	await expect(page.locator('h1')).toHaveText('Typography semantic tokens for web');
	await expect(page).toHaveScreenshot('reference-web-tokens-typography-semantic.png', {threshold: 0.2});
});
