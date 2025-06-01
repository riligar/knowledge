#!/usr/bin/env node

import { getAvailablePort, isPortAvailable } from '../src/port-utils.ts';

async function testPortUtils() {
    console.log('🧪 Testando funções de porta...');

    // Testar se a porta 8080 está disponível em localhost
    const port8080LocalhostAvailable = await isPortAvailable(8080, 'localhost');
    console.log(`Porta 8080 disponível em localhost: ${port8080LocalhostAvailable}`);

    // Testar se a porta 8080 está disponível em 127.0.0.1
    const port8080_127Available = await isPortAvailable(8080, '127.0.0.1');
    console.log(`Porta 8080 disponível em 127.0.0.1: ${port8080_127Available}`);

    // Testar se a porta 8080 está disponível em 0.0.0.0
    const port8080_0Available = await isPortAvailable(8080, '0.0.0.0');
    console.log(`Porta 8080 disponível em 0.0.0.0: ${port8080_0Available}`);

    // Testar getAvailablePort
    const result = await getAvailablePort(8080, 'localhost');
    console.log(`Resultado getAvailablePort(8080, 'localhost'):`, result);
}

testPortUtils().catch(console.error); 