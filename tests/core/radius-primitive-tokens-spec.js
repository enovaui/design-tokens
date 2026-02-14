// @ts-check
import {test, expect} from '@playwright/test';

import {setupViewport} from '../utils/test-utils';

import * as token from '../../packages/core-tokens/json/radius-primitive.json'

test('core tokens radius HTML renders and matches screenshot', async ({page}) => {
	setupViewport(page, token, 1280, 'Radius primitive tokens');
	await expect(page.locator('h1')).toHaveText('Radius primitive tokens');
	await expect(page).toHaveScreenshot('reference-core-tokens-radius-primitive.png', {threshold: 0.2});
});
