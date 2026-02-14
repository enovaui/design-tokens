// @ts-check
import {test, expect} from '@playwright/test';

import {setupViewport} from '../utils/test-utils';

import * as token from '../../packages/core-tokens/json/spacing-primitive.json'

test('core tokens spacing HTML renders and matches screenshot', async ({page}) => {
	setupViewport(page, token, 1280, 'Spacing primitive tokens');
	await expect(page.locator('h1')).toHaveText('Spacing primitive tokens');
	await expect(page).toHaveScreenshot('reference-core-tokens-spacing-primitive.png', {threshold: 0.2});
});
