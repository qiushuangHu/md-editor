<template>
  <div
    class="md-tabs-container bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-end px-2 pt-1"
  >
    <!-- Tab 列表 -->
    <div class="flex items-end gap-1 flex-1 overflow-x-auto">
      <div
        v-for="file in editorStore.files"
        :key="file.id"
        class="md-tab group relative flex items-center gap-2 px-3 py-2 rounded-t-lg cursor-pointer transition-all border-b-2 min-w-[120px] max-w-[200px]"
        :class="[
          file.id === editorStore.activeFileId
            ? 'bg-gray-50 dark:bg-gray-700 border-primary-500 text-gray-800 dark:text-gray-200 font-medium'
            : 'bg-transparent border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50',
        ]"
        @click="editorStore.switchFile(file.id)"
      >
        <!-- 文件图标 -->
        <svg
          class="w-4 h-4 flex-shrink-0 text-primary-500"
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
        <span class="text-sm truncate flex-1" :title="file.fileName">
          {{ file.fileName }}
        </span>

        <!-- 未保存标记 -->
        <span
          v-if="file.isDirty"
          class="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0"
          title="有未保存的更改"
        ></span>

        <!-- 关闭按钮 -->
        <button
          class="md-tab-close w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
          :class="{
            'opacity-100': file.id === editorStore.activeFileId,
          }"
          @click.stop="handleClose(file.id)"
          title="关闭"
        >
          <svg
            class="w-3.5 h-3.5"
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

    <!-- 添加文件按钮 -->
    <button
      class="md-tab-add w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors flex-shrink-0 mb-0.5"
      @click="triggerOpenFile"
      title="打开文件"
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
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from "~/stores/editor";

const editorStore = useEditorStore();
const fileInput = ref<HTMLInputElement | null>(null);

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
        alert(`不支持的文件格式: ${file.name}`);
        continue;
      }

      await editorStore.addFile(file);
    }
  } catch (error) {
    console.error("Failed to load files:", error);
    alert("文件加载失败");
  }

  // 重置input
  input.value = "";
};

// 关闭文件
const handleClose = (id: string) => {
  const file = editorStore.files.find((f) => f.id === id);
  if (!file) return;

  // 如果有未保存的更改，提示用户
  if (file.isDirty) {
    const confirmed = confirm(`"${file.fileName}" 有未保存的更改，是否关闭？`);
    if (!confirmed) return;
  }

  editorStore.removeFile(id);
};
</script>

<style scoped>
/* Tab 容器滚动条样式 */
.md-tabs-container::-webkit-scrollbar {
  height: 2px;
}

.md-tabs-container::-webkit-scrollbar-track {
  background: transparent;
}

.md-tabs-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.dark .md-tabs-container::-webkit-scrollbar-thumb {
  background: #4b5563;
}

/* 防止 tab 被选中 */
.md-tab {
  user-select: none;
}
</style>
