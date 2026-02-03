// @ts-check
import { test, expect } from '@playwright/test';

import {setupViewport} from '../utils/test-utils';

import * as token from '../../packages/web-tokens/json/color-semantic-lg-brand.json'

test('semantic lg brand tokens HTML renders and matches screenshot', async ({ page }) => {
  setupViewport(page, token, 1280, 'Color semantic LG brand tokens for web');
  await expect(page.locator('h1')).toHaveText('Color semantic LG brand tokens for web');
  await expect(page).toHaveScreenshot('reference-web-tokens-color-semantic-lg-brand.png', {threshold: 0.2});
});
