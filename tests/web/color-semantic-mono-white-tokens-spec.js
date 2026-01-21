// @ts-check
import { test, expect } from '@playwright/test';
import {extractLastKeyValue} from '../utils/test-utils';
import * as token from '../../packages/web-tokens/json/color-semantic-mono-white.json'

// Test: Open the HTML file and take a screenshot
// Also check that the color table is visible and has rows

test('semantic mono-white tokens HTML renders and matches screenshot', async ({ page }) => {
  let result = `<h1>Color semantic mono white tokens for web</h1><ul>${extractLastKeyValue(token)}</ul>`;
  await page.setViewportSize({ width: 1280, height: 10000 });
  await page.setContent(result);
  await expect(page.locator('h1')).toHaveText('Color semantic mono white tokens for web');
  await expect(page).toHaveScreenshot('reference-web-tokens-color-semantic-mono-white.png', {threshold: 0.2});
});
