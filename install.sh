#!/bin/bash

# Knowledge Installation Script
# This script installs Knowledge globally on your system

set -e

echo "🚀 Installing Knowledge..."

# Check if Bun is installed
if command -v bun &> /dev/null; then
    echo "✅ Bun detected, using Bun for installation"
    PACKAGE_MANAGER="bun"
elif command -v npm &> /dev/null; then
    echo "✅ npm detected, using npm for installation"
    PACKAGE_MANAGER="npm"
else
    echo "❌ Neither Bun nor npm found. Please install one of them first:"
    echo "   - Bun: https://bun.sh"
    echo "   - Node.js (includes npm): https://nodejs.org"
    exit 1
fi

# Install Knowledge globally
echo "📦 Installing Knowledge globally..."
if [ "$PACKAGE_MANAGER" = "bun" ]; then
    bun install -g .
else
    npm install -g .
fi

echo "✅ Knowledge installed successfully!"
echo ""
echo "🎯 Quick start:"
echo "  1. mkdir my-docs && cd my-docs"
echo "  2. knowledge init"
echo "  3. bun install (or npm install)"
echo "  4. knowledge dev"
echo ""
echo "📖 For more information, see: https://myknowledge.click"
echo "🐛 Report issues at: https://github.com/riligar/knowledge/issues" 