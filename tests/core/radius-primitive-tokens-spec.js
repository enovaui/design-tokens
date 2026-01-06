// @ts-check
import { test, expect } from '@playwright/test';
import {extractLastKeyValue} from '../utils/test-utils';
import * as token from '../../packages/core-tokens/json/radius-primitive.json'

// Test: Open the HTML file and take a screenshot
// Also check that the color table is visible and has rows

test('core tokens radius HTML renders and matches screenshot', async ({ page }) => {
  let result = `<h1>Core Tokens Radius</h1><ul>${extractLastKeyValue(token)}</ul>`;
  await page.setViewportSize({ width: 1280, height: 2000 });
  await page.setContent(result);
  await expect(page.locator('h1')).toHaveText('Core Tokens Radius');
  await expect(page).toHaveScreenshot('reference-tockens-radius.png', {threshold: 0.2});
});
