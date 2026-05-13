<template>
  <div
    class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center gap-1 flex-wrap"
  >
    <!-- 标题 -->
    <button class="btn-icon" @click="insertHeading(1)" title="一级标题">
      <span class="text-sm font-bold">H1</span>
    </button>
    <button class="btn-icon" @click="insertHeading(2)" title="二级标题">
      <span class="text-sm font-bold">H2</span>
    </button>
    <button class="btn-icon" @click="insertHeading(3)" title="三级标题">
      <span class="text-sm font-bold">H3</span>
    </button>

    <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

    <!-- 文本格式 -->
    <button class="btn-icon" @click="insertBold" title="粗体 (Ctrl+B)">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 12h8a4 4 0 100-8H6v8zm0 0h10a4 4 0 110 8H6v-8z"
        />
      </svg>
    </button>
    <button class="btn-icon" @click="insertItalic" title="斜体 (Ctrl+I)">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    </button>
    <button class="btn-icon" @click="insertStrike" title="删除线">
      <span class="text-sm line-through font-bold">S</span>
    </button>

    <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

    <!-- 列表 -->
    <button class="btn-icon" @click="insertUnorderedList" title="无序列表">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
        />
      </svg>
    </button>
    <button class="btn-icon" @click="insertOrderedList" title="有序列表">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 7h12M7 12h12M7 17h12M3 7h.01M3 12h.01M3 17h.01"
        />
      </svg>
    </button>
    <button class="btn-icon" @click="insertTaskList" title="任务列表">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    </button>

    <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

    <!-- 引用和代码 -->
    <button class="btn-icon" @click="insertBlockquote" title="引用">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    </button>
    <button class="btn-icon" @click="insertInlineCode" title="行内代码">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    </button>
    <button class="btn-icon" @click="insertCodeBlock" title="代码块">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </button>

    <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

    <!-- 链接和图片 -->
    <button class="btn-icon" @click="insertLink" title="链接">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    </button>
    <button class="btn-icon" @click="insertImage" title="图片">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </button>

    <div class="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

    <!-- 表格 -->
    <button class="btn-icon" @click="insertTable" title="表格">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    </button>

    <!-- 分割线 -->
    <button class="btn-icon" @click="insertHorizontalRule" title="分割线">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 12H4"
        />
      </svg>
    </button>

    <div class="flex-1"></div>

    <!-- 文件操作 -->
    <input
      ref="fileInput"
      type="file"
      accept=".md,.txt,.markdown"
      class="hidden"
      @change="handleFileUpload"
    />
    <button class="btn btn-secondary" @click="openFile" title="打开文件">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
      <span>打开</span>
    </button>
    <button class="btn btn-primary" @click="saveFile" title="保存文件">
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
        />
      </svg>
      <span>保存</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from "~/stores/editor";
import { useAppStore } from "~/stores/app";

const editorStore = useEditorStore();
const appStore = useAppStore();
const fileInput = ref<HTMLInputElement | null>(null);

// 插入标题
const insertHeading = (level: number) => {
  const prefix = "#".repeat(level) + " ";
  editorStore.insertText("", prefix, "");
};

// 插入粗体
const insertBold = () => {
  editorStore.insertText("粗体文本", "**", "**");
};

// 插入斜体
const insertItalic = () => {
  editorStore.insertText("斜体文本", "*", "*");
};

// 插入删除线
const insertStrike = () => {
  editorStore.insertText("删除线文本", "~~", "~~");
};

// 插入无序列表
const insertUnorderedList = () => {
  editorStore.insertText("\n- 列表项1\n- 列表项2\n- 列表项3");
};

// 插入有序列表
const insertOrderedList = () => {
  editorStore.insertText("\n1. 列表项1\n2. 列表项2\n3. 列表项3");
};

// 插入任务列表
const insertTaskList = () => {
  editorStore.insertText("\n- [ ] 未完成任务\n- [x] 已完成任务");
};

// 插入引用
const insertBlockquote = () => {
  editorStore.insertText("\n> 引用内容");
};

// 插入行内代码
const insertInlineCode = () => {
  editorStore.insertText("code", "`", "`");
};

// 插入代码块
const insertCodeBlock = () => {
  editorStore.insertText("\n```javascript\n// 代码内容\n```\n");
};

// 插入链接
const insertLink = () => {
  editorStore.insertText("链接文本", "[", "](https://example.com)");
};

// 插入图片
const insertImage = () => {
  editorStore.insertText("图片描述", "![", "](https://example.com/image.png)");
};

// 插入表格
const insertTable = () => {
  const table = `
| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 单元格 | 单元格 | 单元格 |
| 单元格 | 单元格 | 单元格 |
`;
  editorStore.insertText(table);
};

// 插入分割线
const insertHorizontalRule = () => {
  editorStore.insertText("\n---\n");
};

// 打开文件
const openFile = () => {
  fileInput.value?.click();
};

// 处理文件上传
const handleFileUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  try {
    await editorStore.loadFile(file);
    appStore.fileName = file.name;
  } catch (error) {
    console.error("Failed to load file:", error);
    alert("文件加载失败");
  }

  // 重置input
  input.value = "";
};

// 保存文件
const saveFile = () => {
  const blob = new Blob([editorStore.content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = appStore.fileName;
  a.click();
  URL.revokeObjectURL(url);
};
</script>
