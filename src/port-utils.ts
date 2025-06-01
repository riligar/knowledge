/**
 * Verifica se uma porta está disponível usando Bun.serve
 */
export async function isPortAvailable(port: number, host: string = 'localhost'): Promise<boolean> {
    try {
        const server = Bun.serve({
            port,
            hostname: host,
            fetch() {
                return new Response('test');
            }
        });

        // Se chegou até aqui, a porta está disponível
        server.stop();
        return true;
    } catch (error: any) {
        // Se deu erro, provavelmente a porta está em uso
        if (error.code === 'EADDRINUSE' || error.message?.includes('port') || error.message?.includes('use')) {
            return false;
        }
        // Para outros erros, assumir que a porta não está disponível
        return false;
    }
}

/**
 * Encontra uma porta disponível a partir de uma porta inicial
 */
export async function findAvailablePort(startPort: number, host: string = 'localhost', maxAttempts: number = 10): Promise<number> {
    for (let i = 0; i < maxAttempts; i++) {
        const port = startPort + i;
        if (await isPortAvailable(port, host)) {
            return port;
        }
    }

    throw new Error(`Não foi possível encontrar uma porta disponível a partir da porta ${startPort} (tentativas: ${maxAttempts})`);
}

/**
 * Obtém uma porta disponível, tentando primeiro a porta preferida
 */
export async function getAvailablePort(preferredPort: number, host: string = 'localhost'): Promise<{ port: number; isPreferred: boolean }> {
    // Primeiro tenta a porta preferida
    if (await isPortAvailable(preferredPort, host)) {
        return { port: preferredPort, isPreferred: true };
    }

    // Se não estiver disponível, encontra uma alternativa
    const availablePort = await findAvailablePort(preferredPort + 1, host);
    return { port: availablePort, isPreferred: false };
} 