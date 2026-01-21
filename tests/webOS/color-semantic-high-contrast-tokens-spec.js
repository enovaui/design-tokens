// @ts-check
import { test, expect } from '@playwright/test';
import {extractLastKeyValue} from '../utils/test-utils';
import * as token from '../../packages/webos-tokens/json/color-semantic-high-contrast.json'

// Test: Open the HTML file and take a screenshot
// Also check that the color table is visible and has rows

test('semantic highcontrast tokens HTML renders and matches screenshot', async ({ page }) => {
  let result = `<h1>Color semantic high contrast tokens for webOS</h1><ul>${extractLastKeyValue(token)}</ul>`;
  await page.setViewportSize({ width: 1280, height: 5000 });
  await page.setContent(result);
  await expect(page.locator('h1')).toHaveText('Color semantic high contrast tokens for webOS');
  await expect(page).toHaveScreenshot('reference-webos-tokens-color-semantic-high-contrast.png', {threshold: 0.2});
});
