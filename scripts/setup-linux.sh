#!/bin/bash

# Linux环境设置脚本 - 解决Puppeteer依赖问题

echo "正在设置Linux环境..."

# 检测操作系统
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    echo "无法检测操作系统"
    exit 1
fi

echo "检测到操作系统: $OS $VER"

# 安装Chrome依赖库
install_chrome_deps() {
    echo "正在安装Chrome依赖库..."
    
    if [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]] || [[ "$OS" == *"OpenCloudOS"* ]]; then
        # CentOS/RHEL/OpenCloudOS
        sudo yum update -y
        sudo yum install -y \
            nss \
            nss-util \
            nss-softokn \
            nss-tools \
            libX11 \
            libXcomposite \
            libXcursor \
            libXdamage \
            libXext \
            libXi \
            libXtst \
            cups-libs \
            libXScrnSaver \
            libXrandr \
            alsa-lib \
            pango \
            atk \
            atk-bridge-x11 \
            gtk3 \
            libdrm \
            libxkbcommon \
            libxshmfence \
            mesa-libgbm \
            libxss \
            libasound2
    elif [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        # Ubuntu/Debian
        sudo apt-get update
        sudo apt-get install -y \
            libnss3 \
            libatk-bridge2.0-0 \
            libdrm2 \
            libxkbcommon0 \
            libxcomposite1 \
            libxdamage1 \
            libxrandr2 \
            libgbm1 \
            libxss1 \
            libasound2 \
            libatspi2.0-0 \
            libgtk-3-0 \
            libxshmfence1
    else
        echo "不支持的操作系统: $OS"
        exit 1
    fi
}

# 安装Chrome浏览器
install_chrome() {
    echo "正在安装Chrome浏览器..."
    
    if [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]] || [[ "$OS" == *"OpenCloudOS"* ]]; then
        # 下载并安装Chrome
        wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
        sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
        sudo yum install -y google-chrome-stable
    elif [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        # Ubuntu/Debian
        wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
        sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
        sudo apt-get update
        sudo apt-get install -y google-chrome-stable
    fi
}

# 创建环境配置文件
create_env_config() {
    echo "正在创建环境配置文件..."
    
    mkdir -p .env
    
    cat > .env/.env.development << EOF
# 数据库配置
DB_TYPE=sqlite
DB_NAME=db/development.sqlite

# 服务器配置
SERVER_PORT=3000
NODE_ENV=development

# Puppeteer配置 - Linux服务器Chrome路径
CHROME_BIN=/usr/bin/google-chrome
EOF

    cat > .env/.env.production << EOF
# 数据库配置
DB_TYPE=sqlite
DB_NAME=db/production.sqlite

# 服务器配置
SERVER_PORT=3000
NODE_ENV=production

# Puppeteer配置 - Linux服务器Chrome路径
CHROME_BIN=/usr/bin/google-chrome
EOF

    cat > .env/.env.test << EOF
# 数据库配置
DB_TYPE=sqlite
DB_NAME=db/test.sqlite

# 服务器配置
SERVER_PORT=3000
NODE_ENV=test

# Puppeteer配置 - Linux服务器Chrome路径
CHROME_BIN=/usr/bin/google-chrome
EOF
}

# 主函数
main() {
    echo "开始设置Linux环境..."
    
    # 安装Chrome依赖
    install_chrome_deps
    
    # 安装Chrome浏览器
    install_chrome
    
    # 创建环境配置
    create_env_config
    
    echo "环境设置完成！"
    echo "现在可以运行: npm run start:dev"
}

# 运行主函数
main 