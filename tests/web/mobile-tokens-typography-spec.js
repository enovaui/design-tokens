// @ts-check
import { test, expect } from '@playwright/test';
import {extractLastKeyValue} from '../utils/test-utils';
import * as token from '../../packages/web-tokens/json/typography-semantic.json'

// Test: Open the HTML file and take a screenshot
// Also check that the color table is visible and has rows

test('web moible tokens typography HTML renders and matches screenshot', async ({ page }) => {
  let result = `<h1>Web Mobile tokens typography</h1><ul>${extractLastKeyValue(token)}</ul>`;
  await page.setViewportSize({ width: 1280, height: 5000 });
  await page.setContent(result);
  await expect(page.locator('h1')).toHaveText('Web Mobile tokens typography');
  await expect(page).toHaveScreenshot('reference-color-web-mobile-tockens-typography.png', {threshold: 0.2});
});
