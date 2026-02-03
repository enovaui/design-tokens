// @ts-check
import { test, expect } from '@playwright/test';

import {setupViewport} from '../utils/test-utils';

import * as token from '../../packages/webos-tokens/json/color-semantic-dark.json'

test('semantic dark tokens HTML renders and matches screenshot', async ({ page }) => {
  setupViewport(page, token, 1280, 'Color semantic dark tokens for webOS');
  await expect(page.locator('h1')).toHaveText('Color semantic dark tokens for webOS');
  await expect(page).toHaveScreenshot('reference-webos-tokens-color-semantic-dark.png', {threshold: 0.2});
});
