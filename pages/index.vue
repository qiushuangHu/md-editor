<template>
  <div
    class="h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col"
  >
    <!-- Header - 更现代的设计 -->
    <header
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-3 flex items-center justify-between shadow-soft"
    >
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-3">
          <!-- Logo图标 -->
          <div
            class="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm"
          >
            <svg
              class="w-5 h-5 text-white"
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
          </div>
          <div
            class="relative group"
            ref="fileInfoRef"
            @mouseenter="handleFileInfoMouseEnter"
            @mouseleave="handleFileInfoMouseLeave"
          >
            <h1
              class="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent cursor-pointer"
            >
              MD Viewer
            </h1>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {{ activeFile?.fileName || "untitled.md" }}
            </p>
          </div>

          <!-- 文件信息提示框（使用Teleport避免被遮挡） -->
          <Teleport to="body">
            <div
              v-if="activeFile?.isImported && showFileInfo"
              class="fixed w-72 bg-white dark:bg-gray-800 rounded-xl shadow-medium border border-gray-200 dark:border-gray-700 p-4 z-[1001]"
              :style="fileInfoPosition"
              @mouseenter="showFileInfo = true"
              @mouseleave="showFileInfo = false"
            >
              <div class="flex items-start gap-3">
                <!-- 文件图标 -->
                <div
                  class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0"
                >
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>

                <!-- 文件信息 -->
                <div class="flex-1 min-w-0">
                  <h3
                    class="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate mb-2"
                  >
                    {{ activeFile?.fileName }}
                  </h3>
                  <div
                    class="space-y-1.5 text-xs text-gray-600 dark:text-gray-400"
                  >
                    <div class="flex items-center gap-2">
                      <svg
                        class="w-3.5 h-3.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                        />
                      </svg>
                      <span
                        >大小:
                        {{ formatFileSize(activeFile?.fileSize || 0) }}</span
                      >
                    </div>
                    <div
                      v-if="activeFile?.lastModified"
                      class="flex items-center gap-2"
                    >
                      <svg
                        class="w-3.5 h-3.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span
                        >修改:
                        {{ formatDateTime(activeFile?.lastModified) }}</span
                      >
                    </div>
                    <div class="flex items-center gap-2">
                      <svg
                        class="w-3.5 h-3.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      <span
                        >字符:
                        {{ editorStore.wordCount.chars.toLocaleString() }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Teleport>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <!-- 工具栏 -->
        <button
          class="btn-icon"
          @click="toggleToolbar"
          :class="{
            'bg-primary-50 dark:bg-primary-900/30 text-primary-600':
              appStore.showToolbar,
          }"
          title="工具栏"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>

        <!-- TOC -->
        <button
          class="btn-icon"
          @click="toggleToc"
          :class="{
            'bg-primary-50 dark:bg-primary-900/30 text-primary-600':
              appStore.showToc,
          }"
          title="目录"
        >
          <svg
            class="w-5 h-5"
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
        </button>

        <!-- 布局切换 -->
        <button
          class="btn-icon"
          @click="toggleLayout"
          :title="`布局: ${appStore.layout}`"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 01-2-2H5a2 2 0 01-2 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
        </button>

        <!-- 分割线 -->
        <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

        <!-- 导出 -->
        <div class="relative" ref="exportMenuRef">
          <button class="btn-icon" @click="toggleExportMenu" title="导出">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </div>

        <!-- 导出菜单（使用Teleport避免被overflow裁剪） -->
        <Teleport to="body">
          <Transition name="slide">
            <div
              v-if="showExportMenu"
              class="fixed w-48 bg-white dark:bg-gray-800 rounded-xl shadow-medium border border-gray-200 dark:border-gray-700 py-2 z-[1000]"
              :style="menuPosition"
            >
              <button
                @click="exportPdf"
                class="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-3 transition-colors"
              >
                <svg
                  class="w-4 h-4 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span>导出 PDF</span>
              </button>
              <button
                @click="exportHtml"
                class="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-3 transition-colors"
              >
                <svg
                  class="w-4 h-4 text-primary-600"
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
                <span>导出 HTML</span>
              </button>
            </div>
          </Transition>
        </Teleport>

        <!-- 主题切换 -->
        <button
          class="btn-icon"
          @click="toggleTheme"
          :title="`主题: ${themeLabel}`"
        >
          <svg
            v-if="appStore.theme === 'light'"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <svg
            v-else-if="appStore.theme === 'dark'"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
      </div>
    </header>

    <!-- Tab 栏 -->
    <MdTabs />

    <!-- Toolbar -->
    <MdToolbar v-if="appStore.showToolbar" />

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden">
      <MdEditorPreview />
    </main>

    <!-- PDF导出Loading遮罩 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isExportingPdf"
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 flex flex-col items-center gap-4"
          >
            <!-- 旋转加载动画 -->
            <div class="relative w-16 h-16">
              <div
                class="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"
              ></div>
              <div
                class="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin"
              ></div>
            </div>
            <div class="text-center">
              <p class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                正在导出PDF
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                请稍候，正在生成文档...
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Footer - 更现代的设计 -->
    <footer
      class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 px-6 py-2.5 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 shadow-soft"
    >
      <div class="flex items-center gap-5">
        <div class="flex items-center gap-2">
          <svg
            class="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          <span class="font-medium"
            >{{ editorStore.wordCount.chars }} 字符</span
          >
        </div>
        <div class="flex items-center gap-2">
          <svg
            class="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          <span class="font-medium">{{ editorStore.wordCount.lines }} 行</span>
        </div>
      </div>
      <div class="flex items-center gap-5">
        <label
          class="flex items-center gap-2 cursor-pointer hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
        >
          <input
            type="checkbox"
            v-model="appStore.syncScroll"
            class="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 cursor-pointer"
          />
          <span>同步滚动</span>
        </label>
        <div v-if="editorStore.lastSaved" class="flex items-center gap-2">
          <svg
            class="w-4 h-4 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>已保存: {{ formatTime(editorStore.lastSaved) }}</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "~/stores/app";
import { useEditorStore } from "~/stores/editor";
import { renderMarkdown } from "~/utils/markdown";
import { exportToPdf, exportToHtml } from "~/utils/export";

const appStore = useAppStore();
const editorStore = useEditorStore();

// 当前激活的文件
const activeFile = computed(() => editorStore.activeFile);

const themeLabel = computed(() => {
  const labels: Record<string, string> = {
    light: "亮色",
    dark: "暗色",
    "eye-care": "护眼",
  };
  return labels[appStore.theme] || "亮色";
});

const toggleTheme = () => {
  appStore.toggleTheme();
};

const toggleLayout = () => {
  appStore.toggleLayout();
};

const toggleToc = () => {
  appStore.showToc = !appStore.showToc;
};

const toggleToolbar = () => {
  appStore.showToolbar = !appStore.showToolbar;
};

const exportPdf = async () => {
  if (!editorStore.content) {
    alert("没有可导出的内容");
    return;
  }

  isExportingPdf.value = true;
  showExportMenu.value = false; // 关闭导出菜单

  try {
    const currentFile = editorStore.activeFile;
    const pdfFileName =
      currentFile?.fileName.replace(/\.md$/, ".pdf") || "export.pdf";
    // 使用页面中已渲染的预览元素，而不是创建临时容器
    await exportToPdf("", pdfFileName, true);
  } catch (error) {
    console.error("PDF导出失败:", error);
    alert("PDF导出失败，请稍后重试");
  } finally {
    isExportingPdf.value = false;
  }
};

const exportHtml = () => {
  if (!editorStore.content) {
    alert("没有可导出的内容");
    return;
  }

  const htmlContent = renderMarkdown(editorStore.content);
  const currentFile = editorStore.activeFile;
  const htmlFileName =
    currentFile?.fileName.replace(/\.md$/, ".html") || "export.html";
  exportToHtml(htmlContent, htmlFileName);
};

const showExportMenu = ref(false);
const exportMenuRef = ref<HTMLElement | null>(null);
const isExportingPdf = ref(false); // PDF导出加载状态

const menuPosition = ref({});

// 文件信息卡片相关
const showFileInfo = ref(false);
const fileInfoRef = ref<HTMLElement | null>(null);
const fileInfoPosition = ref({});

// 显示文件信息卡片
const handleFileInfoMouseEnter = () => {
  if (!editorStore.activeFile?.isImported) return;

  showFileInfo.value = true;

  if (fileInfoRef.value) {
    const rect = fileInfoRef.value.getBoundingClientRect();
    fileInfoPosition.value = {
      left: `${rect.left}px`,
      top: `${rect.bottom + 8}px`,
    };
  }
};

// 隐藏文件信息卡片
const handleFileInfoMouseLeave = () => {
  showFileInfo.value = false;
};

const toggleExportMenu = () => {
  showExportMenu.value = !showExportMenu.value;

  if (showExportMenu.value && exportMenuRef.value) {
    const rect = exportMenuRef.value.getBoundingClientRect();
    menuPosition.value = {
      right: `${window.innerWidth - rect.right}px`,
      top: `${rect.bottom + 8}px`,
    };
  }
};

// 点击外部关闭菜单
const handleClickOutside = (e: MouseEvent) => {
  if (
    showExportMenu.value &&
    exportMenuRef.value &&
    !exportMenuRef.value.contains(e.target as Node)
  ) {
    showExportMenu.value = false;
  }
};

onMounted(() => {
  appStore.applyTheme();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const formatTime = (date: Date | string | null | undefined) => {
  if (!date) return "";
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return "";
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 格式化日期时间
const formatDateTime = (date: Date | string | null | undefined) => {
  if (!date) return "";
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return "";
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};
</script>
