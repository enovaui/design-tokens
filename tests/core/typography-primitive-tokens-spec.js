// @ts-check
import {test, expect} from '@playwright/test';

import {setupViewport} from '../utils/test-utils';

import * as token from '../../packages/core-tokens/json/typography-primitive.json'

test('core tokens typography HTML renders and matches screenshot', async ({page}) => {
	setupViewport(page, token, 1280, 'Typography primitive tokens');
	await expect(page.locator('h1')).toHaveText('Typography primitive tokens');
	await expect(page).toHaveScreenshot('reference-core-tokens-typography-primitive.png', {threshold: 0.2});
});
