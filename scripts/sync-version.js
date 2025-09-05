const fs = require('fs');
const path = require('path');

// Module package paths
const corePath = path.resolve(__dirname, '../packages/core-tokens/package.json');
const mobilePath = path.resolve(__dirname, '../packages/mobile-tokens/package.json');
const webPath = path.resolve(__dirname, '../packages/web-tokens/package.json');
const webosPath = path.resolve(__dirname, '../packages/webos-tokens/package.json');
const rootPath = path.resolve(__dirname, '../package.json');

// Read package JSONs
const core = require(corePath);
const mobile = require(mobilePath);
const web = require(webPath);
const webos = require(webosPath);
const rootPackage = require(rootPath);

// Collect all package versions
const versions = [core.version, mobile.version, web.version, webos.version];

// Check if all versions are the same
const allVersionsAreEqual = versions.every(v => v === versions[0]);

let selectedVersion;

if (allVersionsAreEqual) {
  // If all versions are the same, use the first one
  selectedVersion = versions[0];
  console.log(`All packages have the same version (${selectedVersion}).`);
} else {
  // If versions are different, find the highest one
  selectedVersion = versions.sort((a, b) => {
    const [aMajor, aMinor, aPatch] = a.split('.').map(Number);
    const [bMajor, bMinor, bPatch] = b.split('.').map(Number);

    if (aMajor !== bMajor) return bMajor - aMajor;
    if (aMinor !== bMinor) return bMinor - aMinor;
    return bPatch - aPatch;
  })[0];

  console.log(`Package versions are different. Selected the highest version (${selectedVersion}).`);
  console.log('Version list:', versions.join(', '));
}

// Update root package version
rootPackage.version = selectedVersion;

// Write file
fs.writeFileSync(
  rootPath,
  JSON.stringify(rootPackage, null, 2) + '\n'
);

console.log(`Root package version has been synchronized to ${selectedVersion}.`);