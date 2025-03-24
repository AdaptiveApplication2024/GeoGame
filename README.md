# 游戏化地理学习Web应用

一个通过游戏化quiz和地图可视化帮助用户学习地理知识的Web应用。

## 项目简介

本项目是一个教育性的地理学习平台，通过游戏化的方式帮助用户学习世界各国的知识。用户可以通过回答关于国家的问题来获得积分，解锁新的国家，并在交互式地图上查看学习进度。

### 主要功能

- 用户注册和登录系统
- 个性化地理知识测验
- 游戏化学习机制（积分、国家解锁）
- 交互式地图可视化
- 学习进度追踪

## 技术栈

- 后端：Python + Flask
- 数据库：SQLite
- 前端：React + TypeScript（计划中）
- 地图：Leaflet.js（计划中）

## 项目结构

```
geo-learning-app/
├── backend/
│   ├── app.py              # Flask主应用
│   ├── models/             # 数据模型
│   │   ├── country.py      # 国家模型
│   │   └── user.py         # 用户模型
│   ├── services/           # 业务逻辑
│   │   ├── quiz.py         # 测验服务
│   │   └── progress.py     # 进度服务
│   ├── db/                 # 数据库
│   │   └── geo_app.db      # SQLite数据库
│   ├── data/               # 数据文件
│   │   └── countries.json  # 国家数据
│   └── init_db.py          # 数据库初始化脚本
├── frontend/               # 前端代码（计划中）
├── venv/                   # Python虚拟环境
└── README.md              # 项目文档
```

## 安装说明

1. 克隆项目
```bash
git clone [项目地址]
cd geo-learning-app
```

2. 创建并激活虚拟环境
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
.\venv\Scripts\activate  # Windows
```

3. 安装依赖
```bash
pip install -r requirements.txt
```

4. 初始化数据库
```bash
python backend/init_db.py
```

5. 运行应用
```bash
python backend/app.py
```

应用将在 http://localhost:5001 运行

## API文档

### 用户相关
- POST /api/register - 用户注册
- POST /api/login - 用户登录

### 测验相关
- GET /api/quiz - 获取测验题目
- POST /api/submit - 提交答案

### 进度相关
- GET /api/progress - 获取学习进度
- GET /api/countries - 获取国家列表

## 开发状态

- [x] 项目初始化
- [x] 后端基础架构
- [ ] 数据库实现
- [ ] API实现
- [ ] 前端开发
- [ ] 地图集成

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License 