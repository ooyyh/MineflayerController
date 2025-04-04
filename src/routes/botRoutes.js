const express = require('express');
const botController = require('../controllers/botController');

const router = express.Router();

// 创建机器人 - POST /api/bots
router.post('/bots', botController.createBot);

// 断开机器人连接 - DELETE /api/bots/:playerName
router.delete('/bots/:playerName', botController.disconnectBot);

// 获取所有机器人列表 - GET /api/bots
router.get('/bots', botController.listBots);

// 控制机器人执行指令或发送消息 - GET /api/:playerName/ctrl
router.get('/:playerName/ctrl', botController.controlBot);

module.exports = router;