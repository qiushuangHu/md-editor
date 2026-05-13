# MD Viewer - Markdown 阅读器

一个基于 Vue3 + Nuxt3 的轻量级、高性能 Markdown 阅读器工具网站，支持服务端渲染(SSR)优化性能和 SEO。

## ✨ 功能特性

### 核心功能

- 📝 **实时预览** - 所见即所得的 Markdown 编辑体验
- 🎨 **多主题支持** - 亮色、暗色、护眼三种主题
- 📂 **文件操作** - 支持打开、保存 Markdown 文件
- 🖱️ **拖拽上传** - 拖拽.md 文件即可快速打开
- 📑 **目录导航** - 自动生成文档目录(TOC)
- 🔄 **同步滚动** - 编辑区和预览区滚动同步
- 💾 **自动保存** - 自动保存到 localStorage，防止数据丢失

### 编辑辅助

- 🛠️ **工具栏** - 快捷插入常用 Markdown 语法
- ⌨️ **快捷键** - Ctrl+S 保存、Ctrl+Z 撤销、Ctrl+Shift+Z 重做
- 📊 **字数统计** - 实时显示字符数、词数、行数
- 📐 **多布局模式** - 分屏、仅编辑、仅预览三种布局

### 导出功能

- 📄 **导出 PDF** - 将 Markdown 文档导出为 PDF 格式
- 🌐 **导出 HTML** - 导出为独立 HTML 文件

### 语法支持

- ✅ 标准 CommonMark 和 GFM 规范
- 🎨 代码高亮（支持 50+编程语言）
- 📊 表格渲染
- 🔢 数学公式（KaTeX）
- 📈 图表渲染（Mermaid - 开发中）

## 🚀 快速开始

### 环境要求

- Node.js >= 20.0.0
- pnpm >= 8.0.0（推荐使用）

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

访问 http://localhost:3000 查看效果

### 构建生产版本

```bash
pnpm build
```

### 预览生产构建

```bash
pnpm preview
```

## 📁 项目结构

```
md-viewer/
├── assets/
│   └── css/
│       └── main.css              # 全局样式和Tailwind配置
├── components/
│   ├── MdEditorPreview.vue       # 编辑器和预览组件
│   └── MdToolbar.vue             # 工具栏组件
├── pages/
│   └── index.vue                 # 主页面
├── plugins/
│   └── pinia.ts                  # Pinia状态管理插件
├── stores/
│   ├── app.ts                    # 应用设置状态
│   └── editor.ts                 # 编辑器状态
├── utils/
│   ├── markdown.ts               # Markdown渲染工具
│   └── export.ts                 # 导出功能工具
├── types/
│   └── html2pdf.d.ts             # html2pdf类型声明
├── app.vue                       # 应用根组件
├── nuxt.config.ts                # Nuxt配置文件
├── tailwind.config.js            # Tailwind CSS配置
└── package.json                  # 项目依赖
```

## 🛠️ 技术栈

- **框架**: Vue 3 + Nuxt 3 (SSR)
- **状态管理**: Pinia
- **样式**: Tailwind CSS
- **Markdown 解析**: markdown-it
- **代码高亮**: highlight.js
- **数学公式**: KaTeX
- **HTML 清理**: DOMPurify
- **PDF 导出**: html2pdf.js
- **图表**: Mermaid（计划中）

## 📖 使用说明

### 基本操作

1. **编辑内容**: 在左侧编辑区输入 Markdown 文本
2. **实时预览**: 右侧自动显示渲染效果
3. **保存文件**: 点击工具栏"保存"按钮或 Ctrl+S
4. **打开文件**: 点击工具栏"打开"按钮选择.md 文件
5. **拖拽上传**: 直接将.md 文件拖入页面

### 快捷键

- `Ctrl + S` - 保存文档
- `Ctrl + Z` - 撤销
- `Ctrl + Shift + Z` - 重做
- `Ctrl + B` - 粗体
- `Ctrl + I` - 斜体

### 主题切换

点击右上角主题按钮切换：

- ☀️ 亮色主题（默认）
- 🌙 暗色主题
- 👁️ 护眼模式

### 布局切换

点击布局按钮切换显示模式：

- 分屏模式（编辑+预览）
- 仅编辑模式
- 仅预览模式

## 🎯 开发计划

### Phase 1 ✅ (已完成)

- [x] 基础 Markdown 解析和渲染
- [x] 手动输入/粘贴
- [x] 文件上传和拖拽
- [x] 亮色/暗色/护眼主题
- [x] 代码高亮
- [x] 同步滚动
- [x] 分屏模式切换
- [x] 导出 PDF/HTML
- [x] 自动保存
- [x] 目录导航(TOC)
- [x] 工具栏快捷插入

### Phase 2 (进行中)

- [ ] 数学公式完整支持
- [ ] Mermaid 图表渲染
- [ ] 字体大小和行高调节
- [ ] URL 导入功能
- [ ] 自定义快捷键配置
- [ ] PWA 离线支持

### Phase 3 (计划中)

- [ ] 分享链接生成
- [ ] 自定义 CSS 主题
- [ ] 历史版本管理
- [ ] 批量文件处理
- [ ] 协作预览功能

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📮 联系方式

如有问题或建议，请提交 Issue。
