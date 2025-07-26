import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { TimeoutError } from 'puppeteer';

import { INIT_API_URL, NEXT_20_URL as next20Url, MAIN_KEYS, STATS_KEYS, MEDIA_KEY } from './config.js';
import fetchJSONData from './fetch.js';

// 启用反检测插件
puppeteer.use(StealthPlugin());

// 初始化浏览器和页面
// 这里的浏览器配置可以根据需要进行调整
async function setupBrowserAndPage() {
  const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    // '--proxy-server=socks5://127.0.0.1:1086',
    '--disable-blink-features=AutomationControlled'
  ];
  if (process.env.NODE_ENV === 'development') {
    // 开发环境下禁用 Web 安全策略
    args.push('--disable-web-security');  
    // 开发环境下使用代理
    args.push('--proxy-server=socks5://127.0.0.1:1086'); 
  }
  const browser = await puppeteer.launch({
    args,
    defaultViewport: { width: 600, height: 1000 }
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });
  return { browser, page };
}

// 初��化函数，获取最新的20条消息
async function getInitializeData() {
  const { browser, page } = await setupBrowserAndPage();
  let initialData = null;
  let tryCount = 0;
  const maxRetries = 5;
  try{
    while (tryCount < maxRetries) {
      try {
        initialData = await fetchJSONData({ page, browser, url: INIT_API_URL });
        break;
      } catch (error) {
        console.error(`fetch error, 剩余尝试次数: ${maxRetries - tryCount}, 错误信息: ${error.message}`);
        tryCount++;
        if (tryCount >= maxRetries) {
          // throw new Error('获取初始化数据失败，已达到最大重试次数。');
          throw error;
        } else {
          // 等待5秒后重试
          await new Promise(resolve => setTimeout(resolve, 5000)); 
        }
      }
    }
  }catch(error){
    console.error('获取初始化数据失败:', error);
  }
  return initialData;
}

// 加载下一批20条消息， 通过传入sinceID来获取自该ID之后的20条消息
async function loadNext20Items(sinceID) {
  const { browser, page } = await setupBrowserAndPage();
  const NEXT_20_URL = next20Url(sinceID);
  const next20Data = await fetchJSONData({ page, browser, url: NEXT_20_URL });
  return next20Data;
}

export {
  getInitializeData,
  loadNext20Items
};


/////////////////////////////////////////////////////////////////////