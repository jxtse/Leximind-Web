# 贡献指南

感谢您对 LexiMind 项目的关注！我们欢迎任何形式的贡献。

## 🚀 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 数据库
- OpenAI API Key

### 本地开发设置

1. **Fork 并克隆项目**
```bash
git clone https://github.com/yourusername/leximind.git
cd leximind
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
复制 `.env.example` 为 `.env` 并配置：
```env
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
```

4. **数据库设置**
```bash
npm run db:push
```

5. **启动开发服务器**
```bash
npm run dev
```

## 🤝 如何贡献

### 报告 Bug
1. 在 [Issues](https://github.com/yourusername/leximind/issues) 中搜索是否已有相同问题
2. 如果没有，请创建新的 Issue，并提供：
   - 清晰的问题描述
   - 重现步骤
   - 期望的行为
   - 实际发生的行为
   - 环境信息（浏览器、操作系统等）

### 提出新功能
1. 在 Issues 中创建 Feature Request
2. 详细描述功能需求和使用场景
3. 等待社区讨论和反馈

### 代码贡献
1. Fork 项目到您的 GitHub 账户
2. 创建新的功能分支：`git checkout -b feature/awesome-feature`
3. 进行开发并提交代码：`git commit -m 'Add awesome feature'`
4. 推送到分支：`git push origin feature/awesome-feature`
5. 创建 Pull Request

## 📝 开发规范

### 代码风格
- 使用 TypeScript
- 遵循 ESLint 配置
- 使用语义化的变量和函数命名
- 添加必要的注释

### 提交信息
使用清晰的提交信息格式：
```
type(scope): description

[可选的详细描述]
```

类型包括：
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 其他杂项

### Pull Request
- 确保代码通过所有测试
- 添加适当的测试用例
- 更新相关文档
- 链接相关的 Issues

## 🏗️ 项目结构

```
leximind/
├── client/               # 前端代码
│   ├── src/
│   │   ├── components/   # React 组件
│   │   ├── pages/        # 页面组件
│   │   ├── lib/          # 工具函数
│   │   └── hooks/        # 自定义 Hook
├── server/               # 后端代码
│   ├── routes.ts         # API 路由
│   ├── storage.ts        # 数据存储层
│   ├── openai.ts         # AI 集成
│   └── db.ts             # 数据库连接
├── shared/               # 共享类型和 Schema
└── docs/                 # 文档
```

## 🎯 开发重点

### 当前优先级
1. 性能优化
2. 用户体验改进
3. 多语言支持
4. 移动端适配
5. 测试覆盖率提升

### 技术栈
- **前端**: React 18 + TypeScript + Tailwind CSS
- **后端**: Node.js + Express + Drizzle ORM
- **数据库**: PostgreSQL
- **AI**: OpenAI GPT-4o

## 📞 联系方式

- **Issues**: [GitHub Issues](https://github.com/yourusername/leximind/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/leximind/discussions)

## 📄 许可证

贡献的代码将遵循项目的 MIT 许可证。

---

再次感谢您对 LexiMind 的贡献！🎉