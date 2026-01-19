// @ts-check
import { test, expect } from '@playwright/test';
import {extractLastKeyValue} from '../utils/test-utils';
import * as token from '../../packages/mobile-tokens/json/color-semantic-web.json'

// Test: Open the HTML file and take a screenshot
// Also check that the color table is visible and has rows

test('mobile web tokens HTML renders and matches screenshot', async ({ page }) => {
  let result = `<h1>Mobile Web tokens</h1><ul>${extractLastKeyValue(token)}</ul>`;
  await page.setViewportSize({ width: 1280, height: 3000 });
  await page.setContent(result);
  await expect(page.locator('h1')).toHaveText('Mobile Web tokens');
  await expect(page).toHaveScreenshot('reference-color-semantic-mobile-web-tokens.png', {threshold: 0.2});
});
