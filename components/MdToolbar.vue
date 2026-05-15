<template>
  <div
    class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center gap-1 flex-wrap h-[45px]"
  >
    <!-- 左侧操作按钮组 -->
    <!-- 预览模式下的工具 -->
    <template v-if="appStore.layout === 'preview-only'">
      <!-- 搜索 -->
      <button class="btn-icon" @click="toggleSearch" title="搜索 (Ctrl+F)">
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      <!-- 打印 -->
      <button class="btn-icon" @click="printDocument" title="打印">
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
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
          />
        </svg>
      </button>

      <!-- 全屏查看 -->
      <button class="btn-icon" @click="toggleFullscreen" title="全屏查看">
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
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      </button>

      <div class="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      <!-- 缩放控制 -->
      <div class="flex items-center gap-1">
        <button
          class="btn-icon"
          @click="zoomOut"
          :disabled="zoomLevel <= 50"
          title="缩小"
        >
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
        <span
          class="text-xs text-gray-600 dark:text-gray-400 min-w-[40px] text-center"
        >
          {{ zoomLevel }}%
        </span>
        <button
          class="btn-icon"
          @click="zoomIn"
          :disabled="zoomLevel >= 200"
          title="放大"
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </template>

    <!-- 编辑模式下的工具按钮组（preview-only模式下隐藏） -->
    <template v-else>
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
    </template>

    <div class="flex-1"></div>

    <!-- 文件操作 -->
    <input
      ref="fileInput"
      type="file"
      accept=".md,.txt,.markdown"
      class="hidden"
      @change="handleFileUpload"
    />
    <button class="btn btn-secondary mr-1" @click="openFile" title="打开文件">
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
    <button class="btn btn-primary" @click="saveCurrentFile" title="保存文件">
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
import { notifyInfo, notifyError } from "~/utils/notification";

const editorStore = useEditorStore();
const appStore = useAppStore();
const fileInput = ref<HTMLInputElement | null>(null);

// 缩放级别
const zoomLevel = ref(100);

// 切换搜索
const toggleSearch = () => {
  if (!process.client) return;

  // 使用浏览器原生查找功能
  // 注意：现代浏览器通常不支持直接调用查找对话框
  // 这里可以提示用户使用 Ctrl+F
  notifyInfo("请使用 Ctrl+F 或 Cmd+F 进行页面内搜索");
};

// 打印文档
const printDocument = () => {
  if (process.client) {
    window.print();
  }
};

// 切换全屏
const toggleFullscreen = () => {
  if (!process.client) return;

  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

// 放大
const zoomIn = () => {
  if (zoomLevel.value < 200) {
    zoomLevel.value += 10;
    applyZoom();
  }
};

// 缩小
const zoomOut = () => {
  if (zoomLevel.value > 50) {
    zoomLevel.value -= 10;
    applyZoom();
  }
};

// 应用缩放
const applyZoom = () => {
  if (!process.client) return;
  const preview = document.querySelector(".markdown-preview");
  if (preview) {
    (preview as HTMLElement).style.transform = `scale(${
      zoomLevel.value / 100
    })`;
    (preview as HTMLElement).style.transformOrigin = "top center";
  }
};

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
    await editorStore.addFile(file);
  } catch (error) {
    console.error("Failed to load file:", error);
    notifyError("文件加载失败，请重试");
  }

  // 重置input
  input.value = "";
};

// 保存当前文件
const saveCurrentFile = () => {
  editorStore.saveCurrentFile();
};
</script>
