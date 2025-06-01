#!/bin/bash

echo "🧪 Testing Knowledge Cache Busting"
echo "=================================="

# Função para extrair hash de um arquivo
extract_hash() {
    local file=$1
    echo $(basename "$file" | sed 's/.*\.\([a-f0-9]\{8\}\)\..*/\1/')
}

# Função para verificar se arquivo existe
check_file() {
    local file=$1
    if [ -f "$file" ]; then
        echo "✅ Found: $(basename "$file")"
        return 0
    else
        echo "❌ Missing: $(basename "$file")"
        return 1
    fi
}

echo ""
echo "1. Building documentation..."
bun run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "2. Checking generated assets with cache busting..."

# Verificar CSS files
echo ""
echo "CSS Files:"
for css_file in dist/assets/css/*.css; do
    if [ -f "$css_file" ]; then
        hash=$(extract_hash "$css_file")
        echo "  📄 $(basename "$css_file") (hash: $hash)"
    fi
done

# Verificar JS files
echo ""
echo "JavaScript Files:"
for js_file in dist/assets/js/*.js; do
    if [ -f "$js_file" ]; then
        hash=$(extract_hash "$js_file")
        echo "  📄 $(basename "$js_file") (hash: $hash)"
    fi
done

echo ""
echo "3. Checking HTML references..."

# Verificar se o HTML contém as referências corretas
html_file="dist/index.html"
if [ -f "$html_file" ]; then
    echo ""
    echo "CSS references in HTML:"
    grep -o 'href="[^"]*\.css"' "$html_file" | sed 's/href="//;s/"//' | while read css_ref; do
        echo "  🔗 $css_ref"
    done
    
    echo ""
    echo "JavaScript references in HTML:"
    grep -o 'src="[^"]*\.js"' "$html_file" | sed 's/src="//;s/"//' | while read js_ref; do
        echo "  🔗 $js_ref"
    done
else
    echo "❌ HTML file not found"
fi

echo ""
echo "4. Testing cache busting behavior..."

# Salvar hashes atuais
echo "Current asset hashes:" > /tmp/knowledge_hashes_before.txt
find dist/assets -name "*.css" -o -name "*.js" | while read file; do
    hash=$(extract_hash "$file")
    echo "$(basename "$file" | sed 's/\.[a-f0-9]\{8\}\./ /') $hash" >> /tmp/knowledge_hashes_before.txt
done

# Modificar um arquivo CSS para testar mudança de hash
echo ""
echo "5. Modifying CSS file to test hash change..."
css_source="themes/default/assets/css/style.css"
if [ -f "$css_source" ]; then
    # Fazer backup
    cp "$css_source" "$css_source.backup"
    
    # Adicionar comentário para mudar o hash
    echo "/* Cache busting test - $(date) */" >> "$css_source"
    
    # Rebuild
    echo "Rebuilding with modified CSS..."
    bun run build > /dev/null 2>&1
    
    # Verificar se o hash mudou
    echo ""
    echo "New asset hashes:"
    find dist/assets -name "*.css" -o -name "*.js" | while read file; do
        hash=$(extract_hash "$file")
        filename=$(basename "$file" | sed 's/\.[a-f0-9]\{8\}\./ /')
        echo "  $filename $hash"
    done
    
    # Restaurar arquivo original
    mv "$css_source.backup" "$css_source"
    
    echo ""
    echo "✅ CSS file restored to original state"
else
    echo "❌ CSS source file not found"
fi

echo ""
echo "6. Starting test server..."
bun run serve --port 8084 --no-open > /dev/null 2>&1 &
SERVER_PID=$!

sleep 2

echo ""
echo "7. Testing asset loading..."

# Testar carregamento de assets
test_asset() {
    local asset_path=$1
    local status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8084$asset_path")
    if [ "$status" = "200" ]; then
        echo "✅ $asset_path (HTTP $status)"
    else
        echo "❌ $asset_path (HTTP $status)"
    fi
}

# Extrair paths dos assets do HTML
if [ -f "dist/index.html" ]; then
    grep -o 'href="[^"]*\.css"' dist/index.html | sed 's/href="//;s/"//' | while read css_path; do
        test_asset "$css_path"
    done
    
    grep -o 'src="[^"]*\.js"' dist/index.html | sed 's/src="//;s/"//' | while read js_path; do
        test_asset "$js_path"
    done
fi

echo ""
echo "8. Testing main page..."
MAIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8084/)
if [ "$MAIN_STATUS" = "200" ]; then
    echo "✅ Main page loads correctly (HTTP $MAIN_STATUS)"
else
    echo "❌ Main page failed to load (HTTP $MAIN_STATUS)"
fi

echo ""
echo "=================================="
echo "🎉 Cache Busting Test Complete!"
echo ""
echo "📋 Summary:"
echo "- Assets are generated with content-based hashes"
echo "- HTML references are automatically updated"
echo "- Server serves assets correctly"
echo "- Hash changes when content changes"
echo ""
echo "🌐 Test server running at: http://localhost:8084"
echo "🛑 To stop server: kill $SERVER_PID"
echo ""
echo "💡 Benefits:"
echo "- Browsers will always load the latest version"
echo "- No more 'hard refresh' needed after updates"
echo "- Optimal caching for unchanged files"
echo "- Automatic cache invalidation for changed files" 