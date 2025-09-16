#!/bin/bash

echo "🧪 Testing Documentation Assets Loading"
echo "=================================="

# Verificar se o build existe
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found. Running build first..."
    bun run build
fi

# Iniciar servidor em background
echo "🚀 Starting test server on port 8082..."
bun run serve --port 8082 --no-open &
SERVER_PID=$!

# Aguardar servidor iniciar
sleep 3

echo ""
echo "🔍 Testing asset loading..."

# Testar CSS
echo -n "CSS files: "
CSS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8082/assets/css/style.css)
if [ "$CSS_STATUS" = "200" ]; then
    echo "✅ OK (HTTP $CSS_STATUS)"
else
    echo "❌ FAILED (HTTP $CSS_STATUS)"
fi

# Testar JS
echo -n "JS files: "
JS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8082/assets/js/search.js)
if [ "$JS_STATUS" = "200" ]; then
    echo "✅ OK (HTTP $JS_STATUS)"
else
    echo "❌ FAILED (HTTP $JS_STATUS)"
fi

# Testar página principal
echo -n "Main page: "
MAIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8082/)
if [ "$MAIN_STATUS" = "200" ]; then
    echo "✅ OK (HTTP $MAIN_STATUS)"
else
    echo "❌ FAILED (HTTP $MAIN_STATUS)"
fi

# Testar Content-Type do CSS
echo -n "CSS Content-Type: "
CSS_CONTENT_TYPE=$(curl -s -I http://localhost:8082/assets/css/style.css | grep -i "content-type" | cut -d' ' -f2- | tr -d '\r\n')
if [[ "$CSS_CONTENT_TYPE" == *"text/css"* ]]; then
    echo "✅ OK ($CSS_CONTENT_TYPE)"
else
    echo "❌ FAILED ($CSS_CONTENT_TYPE)"
fi

# Testar Content-Type do JS
echo -n "JS Content-Type: "
JS_CONTENT_TYPE=$(curl -s -I http://localhost:8082/assets/js/search.js | grep -i "content-type" | cut -d' ' -f2- | tr -d '\r\n')
if [[ "$JS_CONTENT_TYPE" == *"application/javascript"* ]]; then
    echo "✅ OK ($JS_CONTENT_TYPE)"
else
    echo "❌ FAILED ($JS_CONTENT_TYPE)"
fi

echo ""
echo "🌐 Test server running at: http://localhost:8082"
echo "📖 Open the URL above in your browser to verify visually"
echo ""
echo "🛑 To stop the server, run: kill $SERVER_PID"
echo "   Or press Ctrl+C to stop this script and the server"

# Manter o script rodando para que o usuário possa testar
echo ""
echo "Press Ctrl+C to stop the test server..."
wait $SERVER_PID 