#!/usr/bin/env node

// Script simples para testar a funcionalidade de porta
import { createServer } from 'net';

// Simular um servidor ocupando a porta 8080
const testServer = createServer();

testServer.on('error', (err) => {
    console.error('Erro no servidor de teste:', err);
    process.exit(1);
});

testServer.listen(8080, 'localhost', () => {
    console.log('🔒 Servidor de teste ocupando a porta 8080');
    console.log('Agora teste o comando: bun run serve');
    console.log('Pressione Ctrl+C para parar este servidor de teste');
});

process.on('SIGINT', () => {
    console.log('\n👋 Parando servidor de teste...');
    testServer.close(() => {
        process.exit(0);
    });
}); 