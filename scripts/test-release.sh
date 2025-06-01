#!/bin/bash

echo "🧪 Testing semantic-release in dry-run mode..."
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if we have commits
if ! git log --oneline -1 > /dev/null 2>&1; then
    echo "❌ Error: No commits found"
    exit 1
fi

echo "📋 Recent commits:"
git log --oneline -5
echo ""

echo "🔍 Running semantic-release in dry-run mode..."
echo "This will show what would happen without actually releasing"
echo ""

# Run semantic-release in dry-run mode
bunx semantic-release --dry-run

echo ""
echo "✅ Dry-run completed!"
echo ""
echo "💡 Tips:"
echo "- Use conventional commits (feat:, fix:, docs:, etc.)"
echo "- Push to 'prod' branch to trigger actual release"
echo "- Make sure NPM_TOKEN is set in GitHub secrets" 