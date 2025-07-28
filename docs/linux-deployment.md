# Linux部署问题解决方案

## 问题描述

在Linux服务器（特别是OpenCloudOS 8.10）上运行项目时，Puppeteer报错：

```
Failed to launch the browser process!
error while loading shared libraries: libnss3.so: cannot open shared object file: No such file or directory
```

这是因为缺少Chrome浏览器运行所需的依赖库。

## 解决方案

### 方案1：快速修复（推荐）

在Linux服务器上运行以下命令：

```bash
# 更新系统包
sudo yum update -y

# 安装Chrome依赖库
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

# 安装Chrome浏览器
sudo yum install -y google-chrome-stable
```

### 方案2：使用自动化脚本

运行项目提供的设置脚本：

```bash
chmod +x scripts/setup-linux.sh
./scripts/setup-linux.sh
```

### 方案3：创建环境配置文件

手动创建环境配置文件：

```bash
mkdir -p .env

# 创建开发环境配置
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
```

### 方案4：禁用爬虫功能（临时方案）

如果暂时不需要爬虫功能，可以修改代码跳过爬虫初始化：

```javascript
// 在 src/index.js 中注释掉爬虫初始化
// await initCrawler();
```

## 验证安装

安装完成后，验证Chrome是否正确安装：

```bash
google-chrome --version
```

## 常见问题

### 1. 权限问题
如果遇到权限问题，确保使用sudo运行安装命令。

### 2. 网络问题
如果无法下载Chrome，可以手动下载并安装：
```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
sudo yum install -y google-chrome-stable_current_x86_64.rpm
```

### 3. 依赖冲突
如果遇到依赖冲突，可以尝试：
```bash
sudo yum clean all
sudo yum makecache
```

## 生产环境建议

1. 使用Docker容器化部署，避免环境依赖问题
2. 考虑使用无头浏览器服务（如Browserless）
3. 将爬虫功能独立部署，避免影响主应用 