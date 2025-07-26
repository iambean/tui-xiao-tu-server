
// 从指定 URL 获取 JSON 数据，不管是初始化还是查询指定since ID 之后的20条消息，数据结构都是一致的。
const fetchJSONData = async ({ page, browser, url }) => {
  let retries = 3;
  while (retries > 0) {
    try {
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30 * 1000 // 调整超时时间到 30 秒
      });
      break;
    } catch (error) {
      if (error.name === 'TimeoutError') {
        retries--;
        if (retries === 0) throw error;
        console.log(`导航超时，剩余重试次数: ${retries}`);
      } else {
        throw error;
      }
    }
  }

  // 等待页面加载完成
  await new Promise(resolve => setTimeout(resolve, 5000));


  try{
    const data = await _fetch(page);
    console.log(`${data.length}条消息, 消息格式如：${JSON.stringify(data[0], null, 4)}`);
    return data;
  }catch(error) {
    console.error('运行出错:', error);
  } finally {
    await browser.close();
  }
}

//! page.evaluate 方法类似js 的 eval()，在函数体内，不能引用外部变量和方法。
const _fetch = async (page)=>{
  return await page.evaluate(() => {
    const jsonData = JSON.parse(document.body.innerText);
    console.log(`${jsonData.length}条消息, 消息格式如：${JSON.stringify(jsonData[0], null, 4)}`);
    return jsonData;

    const MAIN_KEYS = [
      'id',
      'created_at', 
      'content',
    ];

    const STATS_KEYS = [
      'replies_count', 
      'reblogs_count', 
      'favourites_count', 
      'upvotes_count',
    ];

    const MEDIA_KEY = 'media_attachments';

    return jsonData.map(item => {
      const result = { stats: {} };
      console.log('11111111111111111')
      MAIN_KEYS.forEach(key => {
        if (key in item) {
          result[key] = item[key];
        }
      });
      console.log('22222222222222222')
      STATS_KEYS.forEach(key => {
        if (key in item) {
          result.stats[key] = item[key];
        }
      });

      // 处理媒体附件
      if (item[MEDIA_KEY] && item[MEDIA_KEY].length > 0) {
        result[MEDIA_KEY] = item[MEDIA_KEY].map(media => ({
          // image | video | gifv
          type: media.type,
          // 媒体文件的 URL, 对应type，image 则是原图，video 则是视频的缩略图，gifv 则是 gif 的缩略图
          url: media.url,
          // 媒体文件的预览图 URL
          preview_url: media.preview_url
        }));
      } else {
        result[MEDIA_KEY] = [];
      }
      return result;
    });
  });
};

export default fetchJSONData;