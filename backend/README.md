# 地理知识问答游戏后端

这是一个基于 Flask 的地理知识问答游戏后端服务，提供用户注册、问题获取、答案提交和进度追踪等功能。

## 环境要求
- Python 3.8+
- SQLite3

## 安装步骤

1. 创建并激活虚拟环境：
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
.\venv\Scripts\activate  # Windows
```

2. 安装依赖：
```bash
pip install -r requirements.txt
```

3. 初始化数据库：
```bash
python init_db.py
```

4. 启动服务：
```bash
cd backend
flask run --port=5001
```

服务将在 http://localhost:5001 运行。

## 重置数据库
如果需要重置数据库（例如：清除所有测试数据），请按以下步骤操作：

1. 停止当前运行的Flask服务
2. 删除数据库文件
3. 重新初始化数据库
4. 重启Flask服务

具体命令如下：
```bash
# 1. 停止Flask服务
pkill -f "flask run"

# 2. 删除数据库文件
rm -f quiz.db

# 3. 重新初始化数据库
python init_db.py

# 4. 重启Flask服务
flask run --port=5001
```

注意：重置数据库会删除所有用户数据，请谨慎操作。

## API 测试用例

### 1. 用户注册
```bash
curl -X POST http://localhost:5001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "nationality": "MR",
    "password": "test123"
  }'
```

预期响应：
```json
{
  "message": "注册成功",
  "user": {
    "user_id": 1,
    "email": "test@example.com",
    "nationality": "MR",
    "current_location": null,
    "score": 0
  }
}
```

### 2. 用户登录
```bash
curl -X POST http://localhost:5001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

预期响应：
```json
{
  "message": "登录成功",
  "user": {
    "user_id": 1,
    "email": "test@example.com",
    "nationality": "MR",
    "current_location": null,
    "score": 0
  }
}
```

### 3. 获取问题
```bash
curl "http://localhost:5001/api/quiz?user_id=1"
```

预期响应：
```json
{
  "question_id": "MR_Capital",
  "question": "What is the capital of Mauritania?",
  "options": ["Nouakchott", "Bamako", "Dakar", "Algiers"],
  "country_iso": "MR",
  "question_type": "Capital"
}
```

### 4. 提交答案
```bash
curl -X POST http://localhost:5001/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "question_id": "MR_Capital",
    "answer": "Nouakchott"
  }'
```

预期响应：
```json
{
  "correct": true,
  "correct_answer": "Nouakchott",
  "explanation": "毛里塔尼亚的首都是努瓦克肖特。"
}
```

### 5. 获取进度
```bash
curl "http://localhost:5001/api/progress?user_id=1"
```

预期响应：
```json
{
  "user": {
    "user_id": 1,
    "email": "test@example.com",
    "nationality": "MR",
    "current_location": null,
    "score": 10
  },
  "progress": {
    "total_countries": 232,
    "unlocked_countries": 0,
    "progress_percentage": 0.0
  },
  "unlocked_countries": [],
  "all_countries": [...]
}
```

## 功能说明

1. 用户系统
   - 支持用户注册（需要邮箱、国籍和密码）
   - 支持用户登录（需要邮箱和密码）
   - 记录用户国籍和当前位置
   - 追踪用户得分

2. 问题系统
   - 基于用户国籍生成问题
   - 支持多种问题类型（首都、货币、国家运动）
   - 提供4个选项的单选题

3. 进度系统
   - 显示已解锁的国家
   - 计算总体进度百分比
   - 提供完整的国家数据库信息

4. 解锁机制
   - 用户从当前位置开始
   - 解锁当前位置的邻国
   - 通过回答问题获得分数

## 注意事项

1. 开发环境配置
   - 确保在正确的目录下运行服务（backend 目录）
   - 使用虚拟环境管理依赖
   - 数据库初始化只需执行一次

2. API 使用
   - 所有请求都需要包含 user_id
   - 提交答案时需要提供完整的 question_id
   - 进度查询会返回完整的国家数据库信息
   - 用户注册时必须提供密码字段

3. 错误处理
   - 服务会返回适当的 HTTP 状态码
   - 错误响应包含详细的错误信息
   - 开发模式下会显示详细的错误追踪 