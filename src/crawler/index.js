import cron from 'node-cron';
import { getInitializeData, loadNext20Items } from './truthSocialCrawler.js';
import TimelineService from '../services/timeline.service.js';

// 系统启动初始化，初始化数据库连接、缓存、日志等，首先拉取 100 条数据作为冷启动数据。
async function init(){
  const timelineService = new TimelineService();
  const initData = await getInitializeData();
  // await timelineService.__saveMany(initData);
  console.log('初始化数据:', initData);

  // 每小时执行一次爬虫任务
  cron.schedule('0 * * * *', async () => {
    console.log('执行定时爬虫任务', new Date().toISOString());
    const data = await loadNext20Items();
    // await timelineService.__saveMany(data);
    console.log(`定时任务执行完成，保存了 ${data.length} 条新数据`);
    console.log('新数据:', data);
  });
}

export { init };