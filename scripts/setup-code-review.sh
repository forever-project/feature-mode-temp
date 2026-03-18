#!/bin/bash
# AI Code Review - 完整安装脚本
# 一键安装所有 CI/CD 组件

set -e

echo "🚀 AI Code Review - CI/CD Integration Setup"
echo "════════════════════════════════════════════"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT=$(pwd)

# 检查 git 仓库
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: Not a git repository${NC}"
    exit 1
fi

# 检查项目结构
if [ ! -d "src" ]; then
    echo -e "${YELLOW}⚠️  Warning: No src/ directory found${NC}"
    echo "   This script expects a React/TypeScript project structure"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${BLUE}📋 Installation Options:${NC}"
echo ""
echo "1. Pre-commit Hook (本地提交前检查)"
echo "2. GitHub Actions (PR 自动审查)"
echo "3. VS Code Extension (编辑器实时检查)"
echo "4. All of the above (推荐)"
echo ""
read -p "Select option (1-4): " OPTION

case $OPTION in
    1)
        INSTALL_PRECOMMIT=true
        ;;
    2)
        INSTALL_GITHUB_ACTIONS=true
        ;;
    3)
        INSTALL_VSCODE=true
        ;;
    4)
        INSTALL_PRECOMMIT=true
        INSTALL_GITHUB_ACTIONS=true
        INSTALL_VSCODE=true
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo "════════════════════════════════════════════"
echo ""

# 安装 Pre-commit Hook
if [ "$INSTALL_PRECOMMIT" = true ]; then
    echo -e "${BLUE}📦 Installing Pre-commit Hook...${NC}"
    
    if [ -f "scripts/pre-commit" ]; then
        cp scripts/pre-commit .git/hooks/pre-commit
        chmod +x .git/hooks/pre-commit
        echo -e "${GREEN}✅ Pre-commit hook installed${NC}"
    else
        echo -e "${YELLOW}⚠️  pre-commit script not found${NC}"
        echo "   Please ensure scripts/pre-commit exists"
    fi
    echo ""
fi

# 安装 GitHub Actions
if [ "$INSTALL_GITHUB_ACTIONS" = true ]; then
    echo -e "${BLUE}📦 Installing GitHub Actions...${NC}"
    
    mkdir -p .github/workflows
    
    if [ -f "scripts/code-review-bot.js" ]; then
        if [ -f ".github/workflows/ai-code-review.yml" ]; then
            echo -e "${YELLOW}⚠️  GitHub Actions workflow already exists${NC}"
            read -p "Overwrite? (y/N) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                # 工作流文件已经在仓库中
                echo -e "${GREEN}✅ GitHub Actions workflow updated${NC}"
            fi
        else
            echo -e "${YELLOW}⚠️  Please manually copy .github/workflows/ai-code-review.yml${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  code-review-bot.js not found${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}📋 GitHub Actions Setup Instructions:${NC}"
    echo "   1. Push these files to your repository"
    echo "   2. Go to Settings → Actions → General"
    echo "   3. Enable 'Read and write permissions' for workflows"
    echo "   4. The workflow will run on every PR"
    echo ""
fi

# 安装 VS Code Extension
if [ "$INSTALL_VSCODE" = true ]; then
    echo -e "${BLUE}📦 Setting up VS Code Extension...${NC}"
    
    if [ -d "vscode-extension" ]; then
        echo -e "${GREEN}✅ VS Code Extension files ready${NC}"
        echo ""
        echo -e "${BLUE}📋 VS Code Extension Installation:${NC}"
        echo "   1. Open VS Code"
        echo "   2. Go to Extensions view (Ctrl+Shift+X)"
        echo "   3. Click '...' → 'Install from VSIX'"
        echo "   4. Or press F5 to debug the extension"
        echo ""
        echo "   To build the extension:"
        echo "   cd vscode-extension"
        echo "   npm install"
        echo "   npm run compile"
    else
        echo -e "${YELLOW}⚠️  vscode-extension directory not found${NC}"
    fi
    echo ""
fi

# 创建配置文件
echo -e "${BLUE}⚙️  Creating configuration files...${NC}"

if [ ! -f ".coderreviewrc" ]; then
cat > .coderreviewrc <> 'EOF'
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
    echo -e "${GREEN}✅ Created .coderreviewrc${NC}"
else
    echo -e "${YELLOW}⚠️  .coderreviewrc already exists${NC}"
fi

# 更新 package.json
echo ""
echo -e "${BLUE}📝 Updating package.json...${NC}"

if [ -f "package.json" ]; then
    if ! grep -q '"code-review"' package.json; then
        echo -e "${YELLOW}⚠️  Please add the following scripts to package.json:${NC}"
        echo ""
        cat <> 'EOF'
"scripts": {
  "code-review": "node scripts/code-review-bot.js",
  "code-review:install": "bash scripts/install-code-review.sh",
  "code-review:uninstall": "rm -f .git/hooks/pre-commit"
}
EOF
        echo ""
    else
        echo -e "${GREEN}✅ Code review scripts already in package.json${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  package.json not found${NC}"
fi

# 创建 .gitignore 条目
echo ""
echo -e "${BLUE}📝 Checking .gitignore...${NC}"

if [ -f ".gitignore" ]; then
    if ! grep -q "code-review-report.md" .gitignore; then
        echo "" >> .gitignore
        echo "# AI Code Review" >> .gitignore
        echo "code-review-report.md" >> .gitignore
        echo -e "${GREEN}✅ Updated .gitignore${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .gitignore not found${NC}"
fi

echo ""
echo "════════════════════════════════════════════"
echo -e "${GREEN}🎉 Installation Complete!${NC}"
echo "════════════════════════════════════════════"
echo ""

# 显示使用说明
echo -e "${BLUE}📖 Usage:${NC}"
echo ""

if [ "$INSTALL_PRECOMMIT" = true ]; then
    echo "Pre-commit Hook:"
    echo "  • Automatically runs on git commit"
    echo "  • Skip with: git commit --no-verify"
    echo ""
fi

if [ "$INSTALL_GITHUB_ACTIONS" = true ]; then
    echo "GitHub Actions:"
    echo "  • Automatically reviews PRs"
    echo "  • Comments on PR with findings"
    echo "  • Blocking issues prevent merge"
    echo ""
fi

if [ "$INSTALL_VSCODE" = true ]; then
    echo "VS Code Extension:"
    echo "  • Real-time diagnostics in editor"
    echo "  • Commands: Ctrl+Shift+P → 'AI Code Review'"
    echo ""
fi

echo "Manual Review:"
echo "  npm run code-review"
echo ""

echo -e "${BLUE}📚 Documentation:${NC}"
echo "  docs/CODE_REVIEW_CI_CD.md"
echo ""

echo -e "${BLUE}⚙️  Configuration:${NC}"
echo "  .coderreviewrc"
echo "  scripts/code-review-bot.js"
echo ""

echo "════════════════════════════════════════════"
