const express = require('express');
const config = require('./config/config');
const botRoutes = require('./routes/botRoutes');

const app = express();

// 中间件设置
app.use(express.json());

// 注册路由
app.use('/api', botRoutes);

// 启动服务器
app.listen(config.PORT, () => {
  console.log(`服务器运行在端口 ${config.PORT}`);
});