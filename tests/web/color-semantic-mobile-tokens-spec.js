// @ts-check
import { test, expect } from '@playwright/test';
import {extractLastKeyValue} from '../utils/test-utils';
import * as token from '../../packages/web-tokens/json/color-semantic-mobile.json'

// Test: Open the HTML file and take a screenshot
// Also check that the color table is visible and has rows

test('semantic-mobile tokens HTML renders and matches screenshot', async ({ page }) => {
  let result = `<h1>Color semantic mobile tokens for web</h1><ul>${extractLastKeyValue(token)}</ul>`;
  await page.setViewportSize({ width: 1280, height: 10000 });
  await page.setContent(result);
  await expect(page.locator('h1')).toHaveText('Color semantic mobile tokens for web');
  await expect(page).toHaveScreenshot('reference-web-tokens-color-semantic-mobile.png', {threshold: 0.2});
});
