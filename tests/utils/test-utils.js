import {expect} from '@playwright/test';

function extractLastKeyValue(value, key = '') {
	let htmlContent = '';
	if (typeof value === 'object' && value !== null) {
		for (const [k, v] of Object.entries(value)) {
			htmlContent += extractLastKeyValue(v, k);
		}
	} else {
		htmlContent += `<li>${key}: ${value}</li>`;
	}
	return htmlContent;
}

export async function setupViewport(page, jsonData, width = 1280, title) {
	const listHtml = extractLastKeyValue(jsonData);
	await page.setContent(`<h1>${title}</h1><ul style=\"margin:0; padding:0;\">${listHtml}</ul>`);

	const rowCount = await page.locator('li').count();
	// default browser font size 16, header font size 40
	const totalHeight = rowCount * 24 + 40;

	await page.setViewportSize({width, height: totalHeight});

	return totalHeight;
}

/**
 * Run a full screenshot test: setup viewport, assert header text and compare screenshot.
 * @param {import('@playwright/test').Page} page
 * @param {object} jsonData
 * @param {number} width
 * @param {string} title
 * @param {string} screenshotName
 * @param {object} options
 */
export async function runScreenshotTest(page, jsonData, width = 1280, title, screenshotName, options = {threshold: 0.2}) {
	// If a custom renderer is provided as the last argument of options, handle it.
	// Backwards-compatible signature: runScreenshotTest(page, jsonData, width, title, screenshotName, options, renderFn)
	let renderFn;
	if (arguments.length >= 7) {
		renderFn = arguments[6];
	}

	if (typeof renderFn === 'function') {
		// renderFn may return a string (html) or an object {html, height}
		const rendered = await Promise.resolve(renderFn(jsonData, title));
		let html;
		let desiredHeight;
		if (typeof rendered === 'string') {
			html = rendered;
		} else if (rendered && typeof rendered === 'object') {
			html = rendered.html;
			desiredHeight = rendered.height;
		} else {
			html = String(rendered);
		}

		await page.setContent(html);
		if (typeof desiredHeight === 'number') {
			await page.setViewportSize({width, height: desiredHeight});
		} else {
			// fallback to counting list items if any
			try {
				const rowCount = await page.locator('li').count();
				const totalHeight = rowCount * 24 + 40;
				await page.setViewportSize({width, height: totalHeight});
			} catch (e) {
				// ignore and proceed
			}
		}

		await expect(page.locator('h1')).toHaveText(title);
		await expect(page).toHaveScreenshot(screenshotName, options);
	} else {
		await setupViewport(page, jsonData, width, title);
		await expect(page.locator('h1')).toHaveText(title);
		await expect(page).toHaveScreenshot(screenshotName, options);
	}
}
