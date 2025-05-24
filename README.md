# LexiMind - 智能单词学习网站

🧠 一个基于LLM的智能单词学习网站，集成翻译、生词本管理和艾宾浩斯记忆算法

## ✨ 功能特色

### 🌐 智能翻译
- 支持多语言智能翻译（英文、中文、日文、韩文）
- AI驱动的重要词汇自动提取
- 可选择仅翻译或翻译+词汇提取模式
- 提供发音、释义和例句

### 📚 生词本管理
- 词汇收藏和分类管理
- 学习进度跟踪统计
- 导出功能（CSV格式）
- 实时搜索和筛选

### 🧠 智能复习系统
- 基于艾宾浩斯遗忘曲线的复习算法
- 四级难度评估（再次、困难、良好、容易）
- 自适应复习间隔调整
- 学习统计和进度可视化

### 🎯 主题词汇生成
- 根据场景或主题生成相关词汇
- 支持不同难度级别（初级、中级、高级、混合）
- 预设常用场景模板
- 批量添加到生词本

## 🛠️ 技术栈

### 前端
- **React 18** - 现代化用户界面
- **TypeScript** - 类型安全
- **Tailwind CSS** - 现代化样式设计
- **Shadcn/ui** - 高质量UI组件库
- **TanStack Query** - 数据获取和状态管理
- **Wouter** - 轻量级路由

### 后端
- **Node.js** - 运行环境
- **Express** - Web服务器框架
- **TypeScript** - 类型安全
- **Drizzle ORM** - 数据库操作
- **PostgreSQL** - 数据持久化

### AI集成
- **OpenAI GPT-4o** - 智能翻译和词汇提取
- **艾宾浩斯遗忘曲线算法** - 科学记忆管理

## 🚀 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 数据库
- OpenAI API Key

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/jxtse/Leximind-Web.git
cd Leximind-Web
```

2. **安装依赖**
```bash
npm install
```

3. **环境配置**
创建 `.env` 文件并配置以下环境变量：
```env
DATABASE_URL=your_postgresql_connection_string
OPENAI_API_KEY=your_openai_api_key
```

4. **数据库设置**
```bash
npm run db:push
```

5. **启动应用**
```bash
npm run dev
```

应用将在 `http://localhost:5000` 启动

## 📖 使用指南

### 智能翻译
1. 在翻译页面输入要翻译的文本
2. 选择源语言和目标语言
3. 开启/关闭词汇提取功能
4. 点击翻译获得结果
5. 将重要词汇添加到生词本

### 生词本管理
1. 查看所有收藏的词汇
2. 使用搜索功能快速查找
3. 查看学习统计数据
4. 导出词汇数据

### 智能复习
1. 系统自动推荐需要复习的词汇
2. 根据记忆效果选择难度等级
3. 算法自动调整下次复习时间
4. 追踪学习进度和正确率

### 主题词汇
1. 输入学习场景或主题
2. 选择词汇难度级别
3. 生成相关词汇列表
4. 批量添加感兴趣的词汇

## 🔧 开发指南

### 项目结构
```
leximind/
├── client/               # 前端代码
│   ├── src/
│   │   ├── components/   # React组件
│   │   ├── pages/        # 页面组件
│   │   ├── lib/          # 工具函数
│   │   └── hooks/        # 自定义Hook
├── server/               # 后端代码
│   ├── routes.ts         # API路由
│   ├── storage.ts        # 数据存储层
│   ├── openai.ts         # AI集成
│   └── db.ts             # 数据库连接
├── shared/               # 共享类型和Schema
└── package.json
```

### 开发命令
```bash
# 启动开发服务器
npm run dev

# 数据库操作
npm run db:push      # 推送Schema到数据库
npm run db:studio    # 打开数据库管理界面

# 构建生产版本
npm run build
```

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 这个项目
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [OpenAI](https://openai.com/) - 提供强大的AI能力
- [Shadcn/ui](https://ui.shadcn.com/) - 优秀的组件库
- [Drizzle ORM](https://orm.drizzle.team/) - 类型安全的ORM
- [Tailwind CSS](https://tailwindcss.com/) - 现代化CSS框架

---

⭐ 如果这个项目对您有帮助，请给我们一个Star！