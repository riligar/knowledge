import { spawn } from 'child_process';

/**
 * Abre uma URL no browser padrão do sistema
 */
export default async function openBrowser(url: string): Promise<void> {
    const platform = process.platform;
    let command: string;
    let args: string[];

    switch (platform) {
        case 'darwin': // macOS
            command = 'open';
            args = [url];
            break;
        case 'win32': // Windows
            command = 'start';
            args = ['', url];
            break;
        default: // Linux e outros Unix-like
            command = 'xdg-open';
            args = [url];
            break;
    }

    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: 'ignore',
            detached: true
        });

        child.on('error', (error) => {
            console.warn(`⚠️  Could not open browser: ${error.message}`);
            resolve(); // Não falhar se não conseguir abrir o browser
        });

        child.on('spawn', () => {
            child.unref(); // Permitir que o processo pai termine sem esperar o browser
            resolve();
        });

        // Timeout de segurança
        setTimeout(() => {
            resolve();
        }, 2000);
    });
} 