// @ts-check
import {test, expect} from '@playwright/test';

import {setupViewport} from '../utils/test-utils';

import * as token from '../../packages/web-tokens/json/color-semantic-mono-white.json'

test('semantic mono-white tokens HTML renders and matches screenshot', async ({page}) => {
	setupViewport(page, token, 1280, 'Color semantic mono white tokens for web');
	await expect(page.locator('h1')).toHaveText('Color semantic mono white tokens for web');
	await expect(page).toHaveScreenshot('reference-web-tokens-color-semantic-mono-white.png', {threshold: 0.2});
});
