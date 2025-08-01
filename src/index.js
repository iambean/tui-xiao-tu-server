import express from 'express';
import path from 'path';

import applyMiddlewares from './middlewares/normal.js';

import DBFactory from './database/DBFactory.js';
import staticRoutes from './routes/static-route.js';
import userRoute from './routes/api/user.route.js';
import timelineRoute from './routes/api/timeline.route.js';

import dotenv from 'dotenv';
import errorHandler from './middlewares/errorHandle.js';

import { init as initCrawler } from './crawler/index.js';

const envFile = path.join(process.cwd(), `.env/.env.${process.env.NODE_ENV}`);
console.log('envFile:', envFile);
// Load environment variables from .env file based on the environment
dotenv.config({ path: envFile });

// 初始化数据库适配器
const dbAdapter = DBFactory.createAdapter();
console.log(`${process.env.DB_TYPE} 数据库适配器已创建.`);

const app = express();

// 使用静态路由
app.use('/', staticRoutes);

// 中间件集中处理
applyMiddlewares(app);

// 传递 dbAdapter 给各个路由模块，方便未来扩展
app.use('/api/users', userRoute(dbAdapter));
app.use('/api/timelines', timelineRoute(dbAdapter));
// app.use('/api/products', productRoutes(dbAdapter));
// app.use('/api/orders', orderRoutes(dbAdapter));

//! 错误处理中间件必须在所有路由之后
app.use(errorHandler);

const { SERVER_PORT = 3000 } = process.env;
let server = null;

(async ()=>{
  await dbAdapter.connect();
  await initCrawler();
  // console.log('数据库连接已建立，应用程序即将启动。',dbAdapter);
  server = app.listen(SERVER_PORT, async () => {
    console.log(`Server running on http://localhost:${SERVER_PORT}`);
    if(process.env.NODE_ENV === "development"){
      console.log(`demo url: http://localhost:${SERVER_PORT}/demo`);
    }
  });
})();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

// 为了集成测试，在运行时导出app给测试套件
export {
  dbAdapter,
  app,
  server,
}