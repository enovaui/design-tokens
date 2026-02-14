// @ts-check
import {test, expect} from '@playwright/test';

import {setupViewport} from '../utils/test-utils';

import * as token from '../../packages/webos-tokens/json/color-semantic-light.json'

test('semanitc light tokens HTML renders and matches screenshot', async ({page}) => {
	setupViewport(page, token, 1280, 'Color semantic light tokens for webOS');
	await expect(page.locator('h1')).toHaveText('Color semantic light tokens for webOS');
	await expect(page).toHaveScreenshot('reference-webos-tokens-color-semantic-light.png', {threshold: 0.2});
});
