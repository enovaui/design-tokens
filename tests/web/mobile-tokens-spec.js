// @ts-check
import { test, expect } from '@playwright/test';
import {extractLastKeyValue} from '../utils/test-utils';
import * as token from '../../packages/web-tokens/json/color-semantic-mobile.json'

// Test: Open the HTML file and take a screenshot
// Also check that the color table is visible and has rows

test('web moible tokens HTML renders and matches screenshot', async ({ page }) => {
  let result = `<h1>Web Mobile tokens</h1><ul>${extractLastKeyValue(token)}</ul>`;
  await page.setViewportSize({ width: 1280, height: 10000 });
  await page.setContent(result);
  await expect(page.locator('h1')).toHaveText('Web Mobile tokens');
  await expect(page).toHaveScreenshot('reference-color-web-mobile-tockens.png', {threshold: 0.2});
});
