#!/bin/bash

echo "🔍 Knowledge Debug Script"
echo "========================="

# Verificar se o build funciona
echo "1. Testing build..."
bun run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Verificar se os arquivos foram gerados
echo ""
echo "2. Checking generated files..."
if [ -f "dist/index.html" ]; then
    echo "✅ index.html generated"
else
    echo "❌ index.html not found"
fi

if [ -f "dist/assets/css/style.css" ]; then
    echo "✅ CSS files generated"
else
    echo "❌ CSS files not found"
fi

if [ -f "dist/assets/js/main.js" ]; then
    echo "✅ JS files generated"
else
    echo "❌ JS files not found"
fi

# Iniciar servidor em background
echo ""
echo "3. Starting server..."
bun run serve --port 8082 &
SERVER_PID=$!

# Aguardar servidor iniciar
sleep 2

# Testar se servidor responde
echo ""
echo "4. Testing server response..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8082)
if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Server responding (HTTP $HTTP_STATUS)"
else
    echo "❌ Server not responding (HTTP $HTTP_STATUS)"
fi

# Testar CSS
echo ""
echo "5. Testing CSS loading..."
CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8082/assets/css/style.css)
if [ "$CSS_STATUS" = "200" ]; then
    echo "✅ CSS loading correctly (HTTP $CSS_STATUS)"
else
    echo "❌ CSS not loading (HTTP $CSS_STATUS)"
fi

# Mostrar primeiras linhas do HTML
echo ""
echo "6. HTML content preview:"
echo "------------------------"
curl -s http://localhost:8082 | head -20

echo ""
echo "========================="
echo "🌐 Server running at: http://localhost:8082"
echo "📁 Files in dist/:"
ls -la dist/ | head -10
echo ""
echo "🛑 To stop server: kill $SERVER_PID"
echo "📖 Open http://localhost:8082 in your browser" 