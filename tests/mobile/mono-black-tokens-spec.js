// @ts-check
import { test, expect } from '@playwright/test';
import {extractLastKeyValue} from '../utils/test-utils';
import * as token from '../../packages/mobile-tokens/json/color-semantic-mono-black.json'

// Test: Open the HTML file and take a screenshot
// Also check that the color table is visible and has rows

test('moible mono-black tokens HTML renders and matches screenshot', async ({ page }) => {
  let result = `<h1>Mobile Mono Black tokens</h1><ul>${extractLastKeyValue(token)}</ul>`;
  await page.setViewportSize({ width: 1280, height: 3000 });
  await page.setContent(result);
  await expect(page.locator('h1')).toHaveText('Mobile Mono Black tokens');
  await expect(page).toHaveScreenshot('reference-color-mobile-mono-black-tockens.png', {threshold: 0.2});
});
