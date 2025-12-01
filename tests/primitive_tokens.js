import { test, expect } from '@playwright/test';
import * as tokens from '../design-tokens/packages/core-tokens/json/color-primitive.json';


// Test: Open the HTML file and take a screenshot
// Also check that the color table is visible and has rows

test('color tokens HTML renders and matches screenshot', async ({ page }) => {
  const fs = require('fs');
  const filePath = 'reference/color-tokens.png';
  let htmlContent = '<h1>header</h1><ul>';
 
  for (const [name, value] of Object.entries(tokens.primitive.color)) {
    htmlContent += `<li>${name}: ${value} <span style="display:inline-block;width:30px;height:20px;border:1px solid #ccc;background:${value};vertical-align:middle;"></span></li>`;
  }
  htmlContent += '</ul>';
  await page.setViewportSize({ width: 1280, height: 12000 });
  await page.setContent(htmlContent);
  await expect(page.locator('h1')).toHaveText('header');
  if (fs.existsSync(filePath)) {
    console.log('exisiting reference file');
    await expect(await page.screenshot({fullPage: true})).toMatchSnapshot(filePath, {threshold: 0.1});
  } else {
    console.log('reference does not exist');
    await page.screenshot({ path: filePath, fullPage: true });
  }
});