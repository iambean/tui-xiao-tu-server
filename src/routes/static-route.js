import express from 'express';
import path from 'path';

const router = express.Router();

// 配置静态文件服务
router.use(express.static(path.join(process.cwd(), '/static')));

// Demo页面路由
router.get('/demo', (req, res) => {
  res.sendFile(path.join(process.cwd(), '/static/user/index.html'));
});

// Timeline页面路由
router.get('/timeline', (req, res) => {
  res.sendFile(path.join(process.cwd(), '/static/timeline/index.html'));
});

export default router;