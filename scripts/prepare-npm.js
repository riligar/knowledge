#!/usr/bin/env node

import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('📦 Preparing package for npm publication...');

// Copy npm-specific README to be the main README for the package
const npmReadme = 'README.npm.md';
const packageReadme = 'README.md.npm';

if (existsSync(npmReadme)) {
    copyFileSync(npmReadme, packageReadme);
    console.log('✅ Copied npm README');
} else {
    console.warn('⚠️  README.npm.md not found');
}

console.log('🎉 Package prepared for publication!');
console.log('');
console.log('Next steps:');
console.log('1. npm login (if not already logged in)');
console.log('2. npm publish --access public'); 