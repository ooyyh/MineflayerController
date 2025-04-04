const mineflayer = require('mineflayer');

// 存储所有创建的机器人实例
const bots = {};

/**
 * 创建并连接一个Minecraft机器人
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.createBot = (req, res) => {
  try {
    const { ip, port, playerName } = req.body;
    console.log(ip + port + playerName)
    
    // 验证必要参数
    if (!ip || !port || !playerName) {
      return res.status(400).json({ 
        success: false, 
        message: '缺少必要参数：ip, port, playerName' 
      });
    }
    
    // 检查是否已存在同名机器人
    if (bots[playerName]) {
      return res.status(400).json({ 
        success: false, 
        message: `名为 ${playerName} 的机器人已存在` 
      });
    }
    
    // 创建机器人实例
    const bot = mineflayer.createBot({
      host: ip,
      port: parseInt(port),
      username: playerName,
      version: '1.8.9' // 可以在配置中设置默认版本或从请求中获取
    });
    
    // 存储机器人实例
    bots[playerName] = bot;
    
    // 设置事件监听器
    bot.once('spawn', () => {
      console.log(`机器人 ${playerName} 已成功连接到服务器 ${ip}:${port}`);
    });
    
    bot.on('error', (err) => {
      console.error(`机器人 ${playerName} 发生错误:`, err);
      delete bots[playerName];
    });
    
    bot.on('end', () => {
      console.log(`机器人 ${playerName} 已断开连接`);
      delete bots[playerName];
    });
    
    // 返回成功响应
    return res.status(201).json({ 
      success: true, 
      message: `机器人 ${playerName} 正在连接到服务器 ${ip}:${port}` 
    });
    
  } catch (error) {
    console.error('创建机器人时发生错误:', error);
    return res.status(500).json({ 
      success: false, 
      message: '服务器内部错误' 
    });
  }
};

/**
 * 断开指定机器人的连接
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.disconnectBot = (req, res) => {
  try {
    const { playerName } = req.params;
    
    // 检查机器人是否存在
    if (!bots[playerName]) {
      return res.status(404).json({ 
        success: false, 
        message: `名为 ${playerName} 的机器人不存在` 
      });
    }
    
    // 断开机器人连接
    bots[playerName].end();
    
    // 返回成功响应
    return res.status(200).json({ 
      success: true, 
      message: `机器人 ${playerName} 已断开连接` 
    });
    
  } catch (error) {
    console.error('断开机器人连接时发生错误:', error);
    return res.status(500).json({ 
      success: false, 
      message: '服务器内部错误' 
    });
  }
};

/**
 * 获取所有活跃机器人的列表
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.listBots = (req, res) => {
  try {
    const botList = Object.keys(bots).map(name => ({
      playerName: name,
      isConnected: bots[name].player ? true : false
    }));
    
    return res.status(200).json({ 
      success: true, 
      bots: botList 
    });
    
  } catch (error) {
    console.error('获取机器人列表时发生错误:', error);
    return res.status(500).json({ 
      success: false, 
      message: '服务器内部错误' 
    });
  }
};

/**
 * 控制机器人执行指令或发送聊天消息
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
exports.controlBot = (req, res) => {
  try {
    const { playerName } = req.params;
    const { invoke } = req.query;
    
    // 验证必要参数
    if (!invoke) {
      return res.status(400).json({ 
        success: false, 
        message: '缺少必要参数：invoke' 
      });
    }
    
    // 检查机器人是否存在
    if (!bots[playerName]) {
      return res.status(404).json({ 
        success: false, 
        message: `名为 ${playerName} 的机器人不存在` 
      });
    }
    
    // 获取机器人实例
    const bot = bots[playerName];
    
    // 检查机器人是否已连接
    if (!bot.player) {
      return res.status(400).json({ 
        success: false, 
        message: `机器人 ${playerName} 尚未完全连接到服务器` 
      });
    }
    
    // 判断是否为命令（以/开头）
    if (invoke.startsWith('/')) {
      // 执行命令（去掉开头的/）
      bot.chat(invoke);
      return res.status(200).json({ 
        success: true, 
        message: `机器人 ${playerName} 已执行命令: ${invoke}` 
      });
    } else {
      // 发送聊天消息
      bot.chat(invoke);
      return res.status(200).json({ 
        success: true, 
        message: `机器人 ${playerName} 已发送消息: ${invoke}` 
      });
    }
    
  } catch (error) {
    console.error('控制机器人时发生错误:', error);
    return res.status(500).json({ 
      success: false, 
      message: '服务器内部错误' 
    });
  }
};