// @ts-check
import { test, expect } from '@playwright/test';
import {extractLastKeyValue} from '../utils/test-utils';
import * as token from '../../packages/webos-tokens/json/color-semantic-light.json'

// Test: Open the HTML file and take a screenshot
// Also check that the color table is visible and has rows

test('semanitc light tokens HTML renders and matches screenshot', async ({ page }) => {
  let result = `<h1>WebOS Light tokens</h1><ul>${extractLastKeyValue(token)}</ul>`;
  await page.setViewportSize({ width: 1280, height: 5000 });
  await page.setContent(result);
  await expect(page.locator('h1')).toHaveText('WebOS Light tokens');
  await expect(page).toHaveScreenshot('reference-webos-tokens-color-semantic-light.png', {threshold: 0.2});
});
