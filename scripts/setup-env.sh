#!/bin/bash

# 跨平台环境设置脚本

echo "正在设置跨平台环境..."

# 检测操作系统
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]]; then
    OS="windows"
else
    echo "不支持的操作系统: $OSTYPE"
    exit 1
fi

echo "检测到操作系统: $OS"

# 创建环境配置文件
create_env_config() {
    echo "正在创建环境配置文件..."
    
    mkdir -p .env
    
    # 开发环境配置
    cat > .env/.env.development << 'EOF'
# 数据库配置
DB_TYPE=sqlite
DB_NAME=db/development.sqlite

# 服务器配置
SERVER_PORT=3000
NODE_ENV=development

# Puppeteer配置 - 跨平台Chrome路径
# Linux: /usr/bin/google-chrome
# macOS: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
# Windows: C:\Program Files\Google\Chrome\Application\chrome.exe
# 留空则自动检测
CHROME_BIN=
EOF

    # 生产环境配置
    cat > .env/.env.production << 'EOF'
# 数据库配置
DB_TYPE=sqlite
DB_NAME=db/production.sqlite

# 服务器配置
SERVER_PORT=3000
NODE_ENV=production

# Puppeteer配置 - 跨平台Chrome路径
CHROME_BIN=
EOF

    # 测试环境配置
    cat > .env/.env.test << 'EOF'
# 数据库配置
DB_TYPE=sqlite
DB_NAME=db/test.sqlite

# 服务器配置
SERVER_PORT=3000
NODE_ENV=test

# Puppeteer配置 - 跨平台Chrome路径
CHROME_BIN=
EOF

    echo "环境配置文件创建完成！"
}

# 检测Chrome安装
detect_chrome() {
    echo "正在检测Chrome安装..."
    
    local chrome_paths=()
    
    if [[ "$OS" == "linux" ]]; then
        chrome_paths=(
            "/usr/bin/google-chrome"
            "/usr/bin/google-chrome-stable"
            "/usr/bin/chromium-browser"
            "/usr/bin/chromium"
        )
    elif [[ "$OS" == "macos" ]]; then
        chrome_paths=(
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
            "/Applications/Chromium.app/Contents/MacOS/Chromium"
        )
    elif [[ "$OS" == "windows" ]]; then
        chrome_paths=(
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
            "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
        )
    fi
    
    for path in "${chrome_paths[@]}"; do
        if [[ -f "$path" ]] || command -v "$path" >/dev/null 2>&1; then
            echo "找到Chrome: $path"
            echo "版本信息:"
            "$path" --version 2>/dev/null || echo "无法获取版本信息"
            return 0
        fi
    done
    
    echo "未找到Chrome浏览器"
    return 1
}

# 安装Chrome（仅Linux）
install_chrome_linux() {
    if [[ "$OS" != "linux" ]]; then
        return
    fi
    
    echo "在Linux上安装Chrome..."
    
    # 检测包管理器
    if command -v yum >/dev/null 2>&1; then
        # CentOS/RHEL/OpenCloudOS
        echo "使用yum包管理器..."
        
        # 安装依赖
        sudo yum install -y \
            nss nss-util nss-softokn nss-tools \
            libX11 libXcomposite libXcursor libXdamage libXext libXi libXtst \
            cups-libs libXScrnSaver libXrandr alsa-lib pango atk \
            gtk3 libdrm libxkbcommon libxshmfence mesa-libgbm
        
        # 下载并安装Chrome
        wget -q -O /tmp/chrome.rpm https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
        sudo yum install -y /tmp/chrome.rpm
        rm /tmp/chrome.rpm
        
    elif command -v apt-get >/dev/null 2>&1; then
        # Ubuntu/Debian
        echo "使用apt包管理器..."
        
        wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
        sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
        sudo apt-get update
        sudo apt-get install -y google-chrome-stable
    fi
}

# 主函数
main() {
    echo "开始设置跨平台环境..."
    
    # 创建环境配置
    create_env_config
    
    # 检测Chrome
    if ! detect_chrome; then
        echo "Chrome未安装，尝试安装..."
        install_chrome_linux
        detect_chrome
    fi
    
    echo "环境设置完成！"
    echo ""
    echo "使用方法："
    echo "  开发环境: npm run start:dev"
    echo "  测试环境: npm run start:test"
    echo "  生产环境: npm run start:prod"
    echo ""
    echo "如果需要指定Chrome路径，请编辑 .env/.env.development 文件中的 CHROME_BIN 变量"
}

# 运行主函数
main 