#!/usr/bin/env node

/**
 * GitHub PR Generator
 * Automatically creates Pull Requests based on token changes.
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

class PRGenerator {
	constructor(options = {}) {
		const repoInfo = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/') : [];
		this.owner = options.owner || repoInfo[0] || 'enovaui';
		this.repo = options.repo || repoInfo[1] || 'design-tokens';
		this.baseBranch = options.baseBranch || process.env.GITHUB_BASE_REF || 'develop';
		this.token = process.env.GITHUB_TOKEN;

		if (!this.token) {
			throw new Error('GITHUB_TOKEN environment variable is required.');
		}
	}

	/**
	 * Make GitHub API request
	 */
	async makeGitHubRequest(endpoint, method = 'GET', data = null) {
		const url = `https://api.github.com${endpoint}`;

		const options = {
			method,
			headers: {
				'Authorization': `token ${this.token}`,
				'Accept': 'application/vnd.github.v3+json',
				'User-Agent': 'enovaui-design-tokens-sync-bot'
			}
		};

		if (data) {
			options.headers['Content-Type'] = 'application/json';
			options.body = JSON.stringify(data);
		}

		try {
			const response = await fetch(url, options);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`GitHub API Error: ${response.status} - ${errorText}`);
			}

			return await response.json();
		} catch (error) {
			console.error('GitHub API request failed:', error);
			throw error;
		}
	}

	/**
	 * Analyze changes and generate branch name
	 */
	generateBranchName(changes) {
		const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
		const changeTypes = [];

		if (Object.keys(changes.added).length > 0) changeTypes.push('add');
		if (Object.keys(changes.modified).length > 0) changeTypes.push('update');
		if (Object.keys(changes.removed).length > 0) changeTypes.push('remove');

		const suffix = changeTypes.join('-') || 'sync';
		return `figma-sync/${suffix}-${timestamp}`;
	}

	/**
	 * Generate PR title
	 */
	generatePRTitle(changes) {
		const added = Object.keys(changes.added).length;
		const modified = Object.keys(changes.modified).length;
		const removed = Object.keys(changes.removed).length;

		const parts = [];
		if (added > 0) parts.push(`✨ ${added} tokens added`);
		if (modified > 0) parts.push(`🔄 ${modified} tokens modified`);
		if (removed > 0) parts.push(`🗑️ ${removed} tokens removed`);

		return `[Figma Sync] ${parts.join(', ')}`;
	}

	/**
	 * Generate PR body using the pull request template and summarized change info
	 */
	generatePRBody(changes) {
		const added = Object.keys(changes.added).length;
		const modified = Object.keys(changes.modified).length;
		const removed = Object.keys(changes.removed).length;

		const summarize = (obj, type) => {
			const keys = Object.keys(obj);
			if (keys.length === 0) return '-';
			return keys.map(k => {
				const v = obj[k];
				// Modified: show before -> after
				if (type === 'modified' && v && typeof v === 'object' && v.before !== undefined && v.after !== undefined) {
					return `- ${k}: ${stringifySimple(v.before)} -> ${stringifySimple(v.after)}`;
				} else if (type === 'added') {
					return `- ${k}: ${stringifySimple(v)}`;
				} else if (type === 'removed') {
					return `- ${k}: ${stringifySimple(v)}`;
				} else {
					return `- ${k}: ${stringifySimple(v)}`;
				}
			}).join('\n');
		};

		// Helper to flatten and stringify token values for summary
		function stringifySimple(val, prefix = '') {
			if (val && typeof val === 'object' && !Array.isArray(val)) {
				if (val.$ref) return val.$ref;
				return Object.entries(val).map(([k, v]) => {
					const path = prefix ? `${prefix}.${k}` : k;
					return stringifySimple(v, path);
				}).join(', ');
			} else if (val === undefined || val === null) {
				return '';
			} else {
				return prefix ? `${prefix}: ${val}` : `${val}`;
			}
		}

		let body = '';
		body += '### Checklist\n\n';
		body += '* [ ] A CHANGELOG entry is included  \n';
		body += '* [ ] At least one test case is included for this feature or bug fix\n';
		body += '* [ ] Documentation was added or is not needed\n';
		body += '* [ ] This is an API breaking change\n\n';

		body += '### Issue Resolved / Feature Added\n';
		body += `[//]: # (Describe the issue resolved or feature added by this pull request)\n`;
		body += `- Figma Variables Auto Sync\n`;
		body += `- **Sync Time**: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' })} (KST)\n`;
		body += `- **Added**: ${added}, **Modified**: ${modified}, **Removed**: ${removed}\n\n`;

		body += '### Resolution\n';
		body += `[//]: # (Does the code work as intended?)\n`;
		body += `[//]: # (What is the impact of this change and *why* was it made?)\n`;
		body += `**Summary of Changes:**\n`;
		body += `- ✨ **Added**: ${added} tokens\n`;
		body += summarize(changes.added, 'added') + '\n';
		body += `- 🔄 **Modified**: ${modified} tokens\n`;
		body += summarize(changes.modified, 'modified') + '\n';
		body += `- 🗑️ **Removed**: ${removed} tokens\n`;
		body += summarize(changes.removed, 'removed') + '\n\n';

		body += '### Additional Considerations\n';
		body += `[//]: # (How should the change be tested?)\n`;
		body += `[//]: # (Are there any outstanding questions?)\n`;
		body += `[//]: # (Were any side-effects caused by the change?)\n\n`;

		body += '### Links\n';
		body += `[//]: # (Related issues, references)\n\n`;

		body += '### Comments\n';
		body += `[//]: # (DCO should be here)\n`;
		body += '\nEnovaui-DCO-1.0-Signed-off-by: enovaui-bot (enovaui@lge.com)\n';

		return body;
	}

	/**
	 * Format tokens for markdown
	 */
	formatTokensForMarkdown(tokens, prefix = '') {
		let markdown = '';

		Object.entries(tokens).forEach(([key, value]) => {
			const fullKey = prefix ? `${prefix}.${key}` : key;

			if (typeof value === 'object' && value !== null && !value.$ref) {
				markdown += this.formatTokensForMarkdown(value, fullKey);
			} else {
				markdown += `- \`${fullKey}\`: \`${JSON.stringify(value)}\`\n`;
			}
		});

		return markdown;
	}

	/**
	 * Create Git branch and commit changes
	 */
	async createBranchAndCommit(branchName, updatedFiles, changes) {
		try {
			// Create new branch
			console.log(`🌿 Creating branch: ${branchName}`);
			execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });

			// Stage changed files
			if (updatedFiles.length > 0) {
				console.log(`📝 Staging ${updatedFiles.length} files...`);
				updatedFiles.forEach(file => {
					try {
						execSync(`git add "${file}"`, { stdio: 'inherit' });
					} catch (error) {
						console.warn(`Failed to add file: ${file}`, error.message);
					}
				});
			}

			// Generate commit message
			const added = Object.keys(changes.added).length;
			const modified = Object.keys(changes.modified).length;
			const removed = Object.keys(changes.removed).length;

			let commitMessage = '[Figma Sync] Auto-update design tokens';
			const details = [];
			if (added > 0) details.push(`${added} added`);
			if (modified > 0) details.push(`${modified} modified`);
			if (removed > 0) details.push(`${removed} removed`);

			if (details.length > 0) {
				commitMessage += `\n\n- ${details.join('\n- ')}`;
			}

			// Commit
			console.log('💾 Committing changes...');
			execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

			// Push to remote branch
			console.log('📤 Pushing to remote repository...');
			execSync(`git push origin ${branchName}`, { stdio: 'inherit' });

			return true;
		} catch (error) {
			console.error('Git operation failed:', error);
			return false;
		}
	}

	/**
	 * Create Pull Request
	 */
	async createPullRequest(branchName, title, body) {
		try {
			const prData = {
				title,
				body,
				head: branchName,
				base: this.baseBranch,
				maintainer_can_modify: true
			};

			console.log('🔄 Creating Pull Request...');
			const response = await this.makeGitHubRequest(
				`/repos/${this.owner}/${this.repo}/pulls`,
				'POST',
				prData
			);

			return response;
		} catch (error) {
			console.error('Failed to create PR:', error);
			throw error;
		}
	}

	/**
	 * Add labels
	 */
	async addLabels(prNumber, labels = ['design-tokens', 'figma-sync', 'automated']) {
		try {
			await this.makeGitHubRequest(
				`/repos/${this.owner}/${this.repo}/issues/${prNumber}/labels`,
				'POST',
				{ labels }
			);
		} catch (error) {
			console.warn('Failed to add labels:', error);
		}
	}

	/**
	 * Assign reviewers
	 */
	async assignReviewers(prNumber, reviewers = []) {
		if (reviewers.length === 0) return;

		try {
			await this.makeGitHubRequest(
				`/repos/${this.owner}/${this.repo}/pulls/${prNumber}/requested_reviewers`,
				'POST',
				{ reviewers }
			);
		} catch (error) {
			console.warn('Failed to assign reviewers:', error);
		}
	}
}

/**
 * Main execution function
 */
async function main() {
	try {
		console.log('🚀 Starting PR creation process...');

		// Load change data
		const changesPath = path.join(__dirname, '..', 'figma-changes.json');
		const manifestPath = path.join(__dirname, '..', 'token-update-manifest.json');

		if (!await fs.pathExists(changesPath) || !await fs.pathExists(manifestPath)) {
			console.log('No changes files found. Please run figma-sync.js and token-transformer.js first.');
			return;
		}

		const changesData = await fs.readJson(changesPath);
		const manifestData = await fs.readJson(manifestPath);

		const { changes } = changesData;
		const { updatedFiles } = manifestData;

		// Exit if no changes
		const totalChanges = Object.keys(changes.added).length +
							Object.keys(changes.modified).length +
							Object.keys(changes.removed).length;

		if (totalChanges === 0) {
			console.log('No changes detected. PR will not be created.');
			return;
		}

		const prGenerator = new PRGenerator();

		// Generate branch name and PR content
		const branchName = prGenerator.generateBranchName(changes);
		const title = prGenerator.generatePRTitle(changes);
		const body = prGenerator.generatePRBody(changes);

		console.log(`📋 PR Information:`);
		console.log(`- Branch: ${branchName}`);
		console.log(`- Title: ${title}`);
		console.log(`- Changed files: ${updatedFiles.length}`);

		// Create Git branch and commit
		const success = await prGenerator.createBranchAndCommit(branchName, updatedFiles, changes);
		if (!success) {
			console.error('❌ Git operations failed.');
			process.exit(1);
		}

		// Create Pull Request
		const pullRequest = await prGenerator.createPullRequest(branchName, title, body);
		console.log(`✅ Pull Request created successfully!`);
		console.log(`🔗 URL: ${pullRequest.html_url}`);

		// Add labels and reviewers
		await prGenerator.addLabels(pullRequest.number);

		// Read reviewers from environment variable
		const reviewers = process.env.PR_REVIEWERS ? process.env.PR_REVIEWERS.split(',') : [];
		if (reviewers.length > 0) {
			await prGenerator.assignReviewers(pullRequest.number, reviewers);
			console.log(`👥 Reviewers assigned: ${reviewers.join(', ')}`);
		}

		// Save success information
		const resultPath = path.join(__dirname, '..', 'pr-result.json');
		await fs.writeJson(resultPath, {
			timestamp: new Date().toISOString(),
			success: true,
			pullRequest: {
				number: pullRequest.number,
				url: pullRequest.html_url,
				branch: branchName
			},
			changes: {
				added: Object.keys(changes.added).length,
				modified: Object.keys(changes.modified).length,
				removed: Object.keys(changes.removed).length
			}
		}, { spaces: 2 });

		console.log('🎉 PR creation process completed!');

	} catch (error) {
		console.error('❌ Failed to create PR:', error);
		process.exit(1);
	}
}

// Call main function only when script is executed directly
if (require.main === module) {
	main();
}

module.exports = {
	PRGenerator
};
