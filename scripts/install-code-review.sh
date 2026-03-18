#!/bin/bash
# 安装 AI Code Review 工具到项目
# 用法: ./scripts/install-code-review.sh

set -e

echo "🚀 Installing AI Code Review Tools..."
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查是否在 git 仓库中
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: Not a git repository${NC}"
    echo "Please run this script from the root of your git repository"
    exit 1
fi

# 创建必要的目录
echo "📁 Creating directories..."
mkdir -p .github/workflows
mkdir -p scripts

# 安装 pre-commit hook
echo ""
echo "🔗 Installing pre-commit hook..."
if [ -f "scripts/pre-commit" ]; then
    cp scripts/pre-commit .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    echo -e "${GREEN}✅ Pre-commit hook installed${NC}"
else
    echo -e "${YELLOW}⚠️  pre-commit script not found in scripts/ directory${NC}"
fi

# 检查 GitHub Actions 工作流
echo ""
echo "🔧 Checking GitHub Actions workflow..."
if [ -f ".github/workflows/ai-code-review.yml" ]; then
    echo -e "${GREEN}✅ GitHub Actions workflow already exists${NC}"
else
    echo -e "${YELLOW}⚠️  GitHub Actions workflow not found${NC}"
    echo "   Please copy .github/workflows/ai-code-review.yml to your repository"
fi

# 检查审查脚本
echo ""
echo "🤖 Checking code review bot..."
if [ -f "scripts/code-review-bot.js" ]; then
    echo -e "${GREEN}✅ Code review bot script exists${NC}"
else
    echo -e "${YELLOW}⚠️  Code review bot script not found${NC}"
    echo "   Please copy scripts/code-review-bot.js to your repository"
fi

# 添加到 package.json scripts
echo ""
echo "📝 Checking package.json scripts..."
if [ -f "package.json" ]; then
    if ! grep -q '"code-review"' package.json; then
        echo -e "${YELLOW}⚠️  Consider adding the following scripts to package.json:${NC}"
        echo ""
        echo '"scripts": {'
        echo '  "code-review": "node scripts/code-review-bot.js",'
        echo '  "code-review:install": "bash scripts/install-code-review.sh",'
        echo '  "code-review:uninstall": "rm -f .git/hooks/pre-commit"'
        echo '}'
        echo ""
    else
        echo -e "${GREEN}✅ Code review scripts already in package.json${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  package.json not found${NC}"
fi

# 创建 .coderreviewrc 配置文件
echo ""
echo "⚙️  Creating configuration file..."
if [ ! -f ".coderreviewrc" ]; then
    cat > .coderreviewrc << 'EOF'
{
  "reviewPatterns": [
    "src/features/**/*.ts",
    "src/features/**/*.tsx",
    "src/pages/**/*.ts",
    "src/pages/**/*.tsx"
  ],
  "ignorePatterns": [
    "**/*.d.ts",
    "**/*.test.ts",
    "**/*.spec.ts",
    "**/node_modules/**"
  ],
  "blockingThreshold": 1,
  "rules": {
    "enableBlocking": true,
    "enableSuggestion": true
  }
}
EOF
    echo -e "${GREEN}✅ Created .coderreviewrc configuration file${NC}"
else
    echo -e "${GREEN}✅ Configuration file already exists${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo -e "${GREEN}🎉 AI Code Review installation complete!${NC}"
echo "═══════════════════════════════════════════════════"
echo ""
echo "Usage:"
echo "  • Manual review:    npm run code-review"
echo "  • Pre-commit:       Automatically runs on git commit"
echo "  • GitHub PR:        Automatic review on pull requests"
echo ""
echo "Configuration:"
echo "  • Edit .coderreviewrc to customize rules"
echo "  • Edit scripts/code-review-bot.js to add custom rules"
echo ""
echo "To uninstall:"
echo "  rm -f .git/hooks/pre-commit"
echo ""
