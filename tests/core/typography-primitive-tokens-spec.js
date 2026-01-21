// @ts-check
import { test, expect } from '@playwright/test';
import {extractLastKeyValue} from '../utils/test-utils';
import * as token from '../../packages/core-tokens/json/typography-primitive.json'

// Test: Open the HTML file and take a screenshot
// Also check that the color table is visible and has rows

test('core tokens typography HTML renders and matches screenshot', async ({ page }) => {
  let result = `<h1>Typography primitive tokens</h1><ul>${extractLastKeyValue(token)}</ul>`;
  await page.setViewportSize({ width: 1280, height: 4000 });
  await page.setContent(result);
  await expect(page.locator('h1')).toHaveText('Typography primitive tokens');
  await expect(page).toHaveScreenshot('reference-core-tokens-typography-primitive.png', {threshold: 0.2});
});
