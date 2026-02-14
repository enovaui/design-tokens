// @ts-check
import {test, expect} from '@playwright/test';

import {setupViewport} from '../utils/test-utils';

import * as token from '../../packages/web-tokens/json/radius-semantic.json'

test('radius semantic tokens  HTML renders and matches screenshot', async ({page}) => {
	setupViewport(page, token, 1280, 'Radius semantic tokens for webOS');
	await expect(page.locator('h1')).toHaveText('Radius semantic tokens for webOS');
	await expect(page).toHaveScreenshot('reference-webos-tokens-radius-semantic.png', {threshold: 0.2});
});
