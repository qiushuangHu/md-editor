<template>
  <div
    class="md-tabs-container bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-end h-9"
  >
    <!-- 左滚动箭头 -->
    <button
      v-if="showLeftArrow"
      class="md-tabs-arrow w-6 h-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors flex-shrink-0"
      @click="scrollLeft"
      title="向左滚动"
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
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>

    <!-- Tab 列表 -->
    <div
      ref="tabsScrollRef"
      class="flex items-center gap-1 flex-1 overflow-x-auto overflow-y-hidden px-2 scrollbar-hide"
      @wheel.prevent="handleWheelScroll"
    >
      <div
        v-for="file in editorStore.files"
        :key="file.id"
        class="md-tab group relative flex items-center gap-1.5 px-3 h-7 rounded-t cursor-pointer transition-all border-b-2 flex-shrink-0 min-w-fit"
        :class="[
          file.id === editorStore.activeFileId
            ? 'bg-gray-50 dark:bg-gray-700 border-primary-500 text-gray-800 dark:text-gray-200 font-medium'
            : 'bg-transparent border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50',
        ]"
        @click="editorStore.switchFile(file.id)"
        @contextmenu.prevent="handleContextMenu($event, file.id)"
      >
        <!-- 文件图标 -->
        <svg
          class="w-3.5 h-3.5 flex-shrink-0 text-gray-500 dark:text-gray-400"
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

        <!-- 文件名 -->
        <span class="text-xs truncate max-w-[140px]" :title="file.fileName">
          {{ file.fileName }}
        </span>

        <!-- 未保存标记 -->
        <span
          v-if="file.isDirty"
          class="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0"
          title="有未保存的更改"
        ></span>

        <!-- 关闭按钮 -->
        <button
          class="md-tab-close w-4 h-4 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0"
          :class="{
            'opacity-100': file.id === editorStore.activeFileId,
            'opacity-0 group-hover:opacity-100':
              file.id !== editorStore.activeFileId,
          }"
          @click.stop="handleClose(file.id)"
          title="关闭"
        >
          <svg
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 右滚动箭头 -->
    <button
      v-if="showRightArrow"
      class="md-tabs-arrow w-6 h-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors flex-shrink-0"
      @click="scrollRight"
      title="向右滚动"
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
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>

    <!-- 添加文件按钮 -->
    <button
      class="md-tab-add w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors flex-shrink-0 mx-1"
      @click="triggerOpenFile"
      title="打开文件 (Ctrl+O)"
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

    <!-- 隐藏的文件输入 -->
    <input
      ref="fileInput"
      type="file"
      accept=".md,.txt,.markdown"
      multiple
      class="hidden"
      @change="handleFileUpload"
    />

    <!-- 右键菜单 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showContextMenu"
          class="fixed w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-[1000]"
          :style="contextMenuPosition"
        >
          <button
            v-if="
              contextMenuFileId &&
              contextMenuFileId !== editorStore.activeFileId
            "
            class="w-full px-3 py-1.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            @click="switchToFile(contextMenuFileId!)"
          >
            切换到该文件
          </button>
          <button
            class="w-full px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            @click="handleClose(contextMenuFileId!)"
          >
            关闭
          </button>
          <div class="my-1 border-t border-gray-200 dark:border-gray-700"></div>
          <button
            class="w-full px-3 py-1.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            @click="closeOtherTabs"
          >
            关闭其他标签页
          </button>
          <button
            class="w-full px-3 py-1.5 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            @click="closeAllTabs"
          >
            关闭所有标签页
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from "~/stores/editor";
import { notifyWarning, notifyError } from "~/utils/notification";
import { showConfirm } from "~/utils/confirm";

const editorStore = useEditorStore();
const fileInput = ref<HTMLInputElement | null>(null);
const tabsScrollRef = ref<HTMLElement | null>(null);

// 滚动箭头状态
const showLeftArrow = ref(false);
const showRightArrow = ref(false);

// 右键菜单状态
const showContextMenu = ref(false);
const contextMenuPosition = ref({});
const contextMenuFileId = ref<string>("");

// 触发文件选择
const triggerOpenFile = () => {
  fileInput.value?.click();
};

// 处理文件上传
const handleFileUpload = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = input.files;
  if (!files || files.length === 0) return;

  try {
    // 支持多文件上传
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;

      const allowedTypes = [".md", ".txt", ".markdown"];
      const fileExt = "." + file.name.split(".").pop()?.toLowerCase();

      if (!allowedTypes.includes(fileExt)) {
        notifyWarning(`不支持的文件格式: ${file.name}`);
        continue;
      }

      await editorStore.addFile(file);
    }
  } catch (error) {
    console.error("Failed to load files:", error);
    notifyError("文件加载失败，请重试");
  }

  // 重置input
  input.value = "";
};

// 关闭文件
const handleClose = async (id: string) => {
  const file = editorStore.files.find((f) => f.id === id);
  if (!file) return;

  // 如果有未保存的更改，提示用户
  if (file.isDirty) {
    const confirmed = await showConfirm({
      title: "未保存的更改",
      message: `"${file.fileName}" 有未保存的更改，是否关闭？`,
      confirmText: "关闭",
      cancelText: "取消",
    });
    if (!confirmed) return;
  }

  editorStore.removeFile(id);
  hideContextMenu();
};

// 检查是否需要显示滚动箭头
const checkArrowsVisibility = () => {
  const container = tabsScrollRef.value;
  if (!container) return;

  showLeftArrow.value = container.scrollLeft > 0;
  showRightArrow.value =
    container.scrollLeft < container.scrollWidth - container.clientWidth - 1;
};

// 向左滚动
const scrollLeft = () => {
  const container = tabsScrollRef.value;
  if (!container) return;
  container.scrollBy({ left: -200, behavior: "smooth" });
  setTimeout(checkArrowsVisibility, 300);
};

// 向右滚动
const scrollRight = () => {
  const container = tabsScrollRef.value;
  if (!container) return;
  container.scrollBy({ left: 200, behavior: "smooth" });
  setTimeout(checkArrowsVisibility, 300);
};

// 鼠标滚轮横向滚动
const handleWheelScroll = (e: WheelEvent) => {
  const container = tabsScrollRef.value;
  if (!container) return;
  container.scrollLeft += e.deltaY;
  setTimeout(checkArrowsVisibility, 50);
};

// 显示右键菜单
const handleContextMenu = (e: MouseEvent, fileId: string) => {
  contextMenuFileId.value = fileId;
  contextMenuPosition.value = {
    left: `${e.clientX}px`,
    top: `${e.clientY}px`,
  };
  showContextMenu.value = true;
};

// 隐藏右键菜单
const hideContextMenu = () => {
  showContextMenu.value = false;
  contextMenuFileId.value = "";
};

// 切换到指定文件
const switchToFile = (fileId: string) => {
  editorStore.switchFile(fileId);
  hideContextMenu();
};

// 关闭其他标签页
const closeOtherTabs = () => {
  if (!contextMenuFileId.value) return;
  const filesToClose = editorStore.files.filter(
    (f) => f.id !== contextMenuFileId.value
  );
  filesToClose.forEach((file) => {
    if (!file.isDirty) {
      editorStore.removeFile(file.id);
    }
  });
  hideContextMenu();
};

// 关闭所有标签页
const closeAllTabs = async () => {
  const hasDirtyFiles = editorStore.files.some((f) => f.isDirty);
  if (hasDirtyFiles) {
    const confirmed = await showConfirm({
      title: "未保存的更改",
      message: "有未保存的更改，是否关闭所有文件？",
      confirmText: "关闭全部",
      cancelText: "取消",
    });
    if (!confirmed) return;
  }
  editorStore.closeAllFiles();
  hideContextMenu();
};

// 点击外部关闭菜单
const handleClickOutside = (e: MouseEvent) => {
  if (showContextMenu.value) {
    hideContextMenu();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  // 初始化时检查箭头可见性
  nextTick(() => {
    checkArrowsVisibility();
  });
  // 监听窗口大小变化
  window.addEventListener("resize", checkArrowsVisibility);
  // 监听文件列表变化
  watch(
    () => editorStore.files.length,
    () => {
      nextTick(checkArrowsVisibility);
    }
  );
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", checkArrowsVisibility);
});
</script>

<style scoped>
/* Tab 箭头按钮样式 */
.md-tabs-arrow {
  border-left: 1px solid #e5e7eb;
}

.dark .md-tabs-arrow {
  border-left-color: #374151;
}

/* 隐藏默认滚动条 */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* 防止 tab 被选中 */
.md-tab {
  user-select: none;
  -webkit-user-select: none;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
