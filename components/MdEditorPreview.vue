<template>
  <div
    class="h-full flex relative"
    :class="layoutClass"
    @drop="handleDrop"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
  >
    <!-- 拖拽上传提示层 -->
    <div
      v-if="isDragging"
      class="absolute inset-0 bg-primary-500/20 dark:bg-primary-500/30 backdrop-blur-sm z-50 flex items-center justify-center border-4 border-primary-500 border-dashed m-4 rounded-lg"
    >
      <div
        class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center"
      >
        <svg
          class="w-16 h-16 mx-auto mb-4 text-primary-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3"
          />
        </svg>
        <p class="text-xl font-semibold text-gray-700 dark:text-gray-200">
          释放以打开文件
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          支持 .md, .txt, .markdown 格式
        </p>
      </div>
    </div>
    <!-- TOC Sidebar - 更现代的设计 -->
    <div
      v-if="appStore.showToc"
      class="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto shadow-soft"
    >
      <div class="p-5">
        <div class="flex items-center gap-2 mb-4">
          <svg
            class="w-5 h-5 text-primary-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 10h16M4 14h10M4 18h7"
            />
          </svg>
          <h3 class="text-sm font-bold text-gray-800 dark:text-gray-200">
            目录
          </h3>
        </div>
        <nav class="space-y-1">
          <a
            v-for="item in toc"
            :key="item.id"
            :href="`#${item.id}`"
            class="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 py-1.5 px-2 rounded-lg transition-all truncate"
            :style="{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }"
            @click.prevent="scrollToHeading(item.id)"
          >
            {{ item.text }}
          </a>
          <p
            v-if="toc.length === 0"
            class="text-sm text-gray-400 italic py-4 text-center"
          >
            暂无目录
          </p>
        </nav>
      </div>
    </div>

    <!-- Editor - 更现代的设计 -->
    <div
      v-show="showEditor"
      class="flex-1 overflow-hidden bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700"
    >
      <div class="h-full flex flex-col">
        <textarea
          ref="editorRef"
          v-model="editorStore.content"
          class="editor-textarea"
          :style="editorStyle"
          @input="onInput"
          @scroll="onEditorScroll"
          @keydown="handleKeydown"
          placeholder="在此输入Markdown内容..."
          spellcheck="false"
        ></textarea>
      </div>
    </div>

    <!-- Preview - 更现代的设计 -->
    <div
      v-show="showPreview"
      class="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      ref="previewRef"
      @scroll="onPreviewScroll"
    >
      <div class="max-w-8xl mx-auto my-8 px-6">
        <div
          v-if="htmlContent"
          class="markdown-preview bg-white dark:bg-gray-800 rounded-2xl shadow-soft border border-gray-200 dark:border-gray-700 p-8"
          v-html="htmlContent"
        ></div>
        <div v-else class="flex items-center justify-center h-full">
          <div class="text-center text-gray-400">
            <svg
              class="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p class="text-lg">在左侧输入Markdown内容开始预览</p>
            <p class="text-sm mt-2 opacity-75">
              支持实时预览、代码高亮、数学公式等功能
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "~/stores/app";
import { useEditorStore } from "~/stores/editor";
import { renderMarkdown, extractToc } from "~/utils/markdown";

const appStore = useAppStore();
const editorStore = useEditorStore();

const editorRef = ref<HTMLTextAreaElement | null>(null);
const previewRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);

let isScrolling = false;

// 渲染后的HTML
const htmlContent = computed(() => {
  if (!editorStore.content) return "";
  return renderMarkdown(editorStore.content);
});

// 目录
const toc = computed(() => {
  return extractToc(editorStore.content);
});

// 布局类
const layoutClass = computed(() => {
  if (appStore.layout === "editor-only") {
    return "flex-row";
  }
  if (appStore.layout === "preview-only") {
    return "flex-row";
  }
  return appStore.splitDirection === "horizontal" ? "flex-row" : "flex-col";
});

// 是否显示编辑器
const showEditor = computed(() => {
  return appStore.layout === "split" || appStore.layout === "editor-only";
});

// 是否显示预览
const showPreview = computed(() => {
  return appStore.layout === "split" || appStore.layout === "preview-only";
});

// 编辑器样式
const editorStyle = computed(() => ({
  fontSize: `${appStore.fontSize}px`,
  lineHeight: appStore.lineHeight,
}));

// 输入处理
const onInput = () => {
  editorStore.isDirty = true;
};

// 编辑器滚动
const onEditorScroll = (e: Event) => {
  if (!appStore.syncScroll || isScrolling) return;

  const textarea = e.target as HTMLTextAreaElement;
  const preview = previewRef.value;
  if (!preview) return;

  isScrolling = true;

  const scrollRatio =
    textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
  preview.scrollTop =
    scrollRatio * (preview.scrollHeight - preview.clientHeight);

  setTimeout(() => {
    isScrolling = false;
  }, 50);
};

// 预览滚动
const onPreviewScroll = (e: Event) => {
  if (!appStore.syncScroll || isScrolling) return;

  const preview = e.target as HTMLElement;
  const textarea = editorRef.value;
  if (!textarea) return;

  isScrolling = true;

  const scrollRatio =
    preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
  textarea.scrollTop =
    scrollRatio * (textarea.scrollHeight - textarea.clientHeight);

  setTimeout(() => {
    isScrolling = false;
  }, 50);
};

// 键盘快捷键
const handleKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === "s") {
      e.preventDefault();
    } else if (e.key === "z") {
      e.preventDefault();
      if (e.shiftKey) {
        editorStore.redo();
      } else {
        editorStore.undo();
      }
    }
  }
};

// 滚动到标题
const scrollToHeading = (id: string) => {
  const preview = previewRef.value;
  if (!preview) return;

  try {
    // 使用 CSS.escape 转义特殊字符
    const selector = `#${CSS.escape(id)}`;
    const element = preview.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } catch (error) {
    console.error("Scroll to heading failed:", error);
  }
};

// 拖拽上传处理
const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  isDragging.value = true;
};

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();

  // 检查是否真正离开了拖拽区域
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  if (
    e.clientX < rect.left ||
    e.clientX > rect.right ||
    e.clientY < rect.top ||
    e.clientY > rect.bottom
  ) {
    isDragging.value = false;
  }
};

const handleDrop = async (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  isDragging.value = false;

  const files = e.dataTransfer?.files;
  if (!files || files.length === 0) return;

  const file = files[0];
  if (!file) return;

  const allowedTypes = [".md", ".txt", ".markdown"];
  const fileExt = "." + file.name.split(".").pop()?.toLowerCase();

  if (!allowedTypes.includes(fileExt)) {
    alert("仅支持 Markdown 文件 (.md, .txt, .markdown)");
    return;
  }

  try {
    await editorStore.loadFile(file);
    appStore.fileName = file.name;
  } catch (error) {
    console.error("Failed to load file:", error);
    alert("文件加载失败");
  }
};

// 防抖渲染
let renderTimeout: ReturnType<typeof setTimeout> | null = null;
watch(
  () => editorStore.content,
  () => {
    if (renderTimeout) {
      clearTimeout(renderTimeout);
    }
    renderTimeout = setTimeout(() => {
      // 渲染已完成，通过computed自动更新
    }, 100);
  },
  { immediate: true }
);
</script>
