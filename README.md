# MineflayerController

A simple web controller implemented by Mineflayer, which can control the robot to join the Minecraft server through API and control its input and output instructions.

## 功能特点

- 通过RESTful API创建和控制Minecraft机器人
- 支持多个机器人同时连接不同服务器
- 可发送聊天消息和执行游戏命令
- 支持Docker容器化部署
- 简单易用的API接口

## 安装说明

### 前提条件

- Node.js 18.x 或更高版本
- npm 或 yarn 包管理器

### 本地安装

1. 克隆仓库

```bash
git clone https://github.com/yourusername/MineflayerController.git
cd MineflayerController
```

2. 安装依赖

```bash
npm install
```

3. 启动服务

```bash
npm start
```

服务器将在默认端口3000上运行。

### Docker部署

1. 构建Docker镜像

```bash
docker build -t mineflayer-controller .
```

2. 运行Docker容器

```bash
docker run -p 3000:3000 -d mineflayer-controller
```

## API文档

### 创建机器人

- **URL**: `/api/bots`
- **方法**: `POST`
- **请求体**:

```json
{
  "ip": "mc.example.com",
  "port": 25565,
  "playerName": "BotName"
}
```

- **成功响应**:

```json
{
  "success": true,
  "message": "机器人 BotName 正在连接到服务器 mc.example.com:25565"
}
```

### 断开机器人连接

- **URL**: `/api/bots/:playerName`
- **方法**: `DELETE`
- **参数**: `playerName` - 机器人名称
- **成功响应**:

```json
{
  "success": true,
  "message": "机器人 BotName 已断开连接"
}
```

### 获取机器人列表

- **URL**: `/api/bots`
- **方法**: `GET`
- **成功响应**:

```json
{
  "success": true,
  "bots": [
    {
      "playerName": "BotName1",
      "isConnected": true
    },
    {
      "playerName": "BotName2",
      "isConnected": true
    }
  ]
}
```

### 控制机器人

- **URL**: `/api/:playerName/ctrl`
- **方法**: `GET`
- **参数**: 
  - `playerName` - 机器人名称（路径参数）
  - `invoke` - 要发送的文本或命令（查询参数）
- **示例**: `/api/BotName/ctrl?invoke=Hello World` 或 `/api/BotName/ctrl?invoke=/gamemode 1`
- **成功响应**:

```json
{
  "success": true,
  "message": "机器人 BotName 已发送消息: Hello World"
}
```

## 使用示例

### 创建机器人并发送消息

```javascript
// 创建机器人
fetch('http://localhost:3000/api/bots', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    ip: 'mc.example.com',
    port: 25565,
    playerName: 'MyBot'
  })
})
.then(response => response.json())
.then(data => console.log(data));

// 发送聊天消息
fetch('http://localhost:3000/api/MyBot/ctrl?invoke=Hello everyone!')
.then(response => response.json())
.then(data => console.log(data));

// 执行游戏命令
fetch('http://localhost:3000/api/MyBot/ctrl?invoke=/tp 0 100 0')
.then(response => response.json())
.then(data => console.log(data));
```

## 技术栈

- Node.js
- Express.js
- Mineflayer

## 许可证

ISC

## 贡献

欢迎提交问题和拉取请求！
