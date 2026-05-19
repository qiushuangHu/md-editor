# 欢迎使用 MD Viewer

这是一个**轻量级**、*高性能*的 Markdown 阅读器。

## 功能特性

### 实时预览

在左侧编辑区输入内容，右侧会~~实时~~自动显示渲染效果。

### 支持的语法

#### 文本格式

- **粗体文本**
- _斜体文本_
- ~~删除线~~
- `行内代码`

#### 列表

无序列表：

- 第一项
- 第二项
  - 子项 1
  - 子项 2

有序列表：

1. 第一步
2. 第二步
3. 第三步

任务列表：

- [x] 已完成任务
- [ ] 未完成任务

#### 引用

> 这是一段引用文字
>
> > 嵌套引用

#### 代码块

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet("World");
```

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
```

#### 表格

| 功能     | 状态      | 优先级 |
| -------- | --------- | ------ |
| 实时预览 | ✅ 已完成 | P0     |
| 主题切换 | ✅ 已完成 | P0     |
| 导出 PDF | ✅ 已完成 | P0     |
| 代码高亮 | ✅ 已完成 | P0     |
| 数学公式 | 🔧 进行中 | P1     |

#### 链接

访问 [Nuxt3 官网](https://nuxt.com) 了解更多

#### 图片

![示例图片](https://via.placeholder.com/600x300)

#### 分割线

---

## 快捷键

- `Ctrl + S` - 保存文档
- `Ctrl + Z` - 撤销
- `Ctrl + Shift + Z` - 重做

## 开始使用

1. 在左侧编辑区输入 Markdown 内容
2. 右侧实时查看渲染效果
3. 使用工具栏快捷插入语法
4. 点击导出按钮保存为 PDF 或 HTML

---

**享受你的 Markdown 之旅！** 🚀
