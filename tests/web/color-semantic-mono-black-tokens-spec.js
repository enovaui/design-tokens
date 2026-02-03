// @ts-check
import { test, expect } from '@playwright/test';

import {setupViewport} from '../utils/test-utils';

import * as token from '../../packages/web-tokens/json/color-semantic-mono-black.json'

test('semantic mono-black tokens HTML renders and matches screenshot', async ({ page }) => {
  setupViewport(page, token, 1280, 'Color semantic mono black tokens for web');
  await expect(page.locator('h1')).toHaveText('Color semantic mono black tokens for web');
  await expect(page).toHaveScreenshot('reference-web-tokens-color-semantic-mono-black.png', {threshold: 0.2});
});
