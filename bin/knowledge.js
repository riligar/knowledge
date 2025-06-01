#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Caminho para o CLI do Knowledge
const cliPath = join(__dirname, '..', 'src', 'cli.ts');

// Executar o CLI com Bun
const child = spawn('bun', ['run', cliPath, ...process.argv.slice(2)], {
    stdio: 'inherit',
    cwd: process.cwd()
});

child.on('exit', (code) => {
    process.exit(code || 0);
});

child.on('error', (error) => {
    console.error('❌ Failed to start Knowledge CLI:', error.message);
    process.exit(1);
}); 