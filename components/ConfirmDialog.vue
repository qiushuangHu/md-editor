<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[10000] flex items-center justify-center"
      >
        <!-- 遮罩层 -->
        <div
          class="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          @click="handleCancel"
        ></div>

        <!-- 对话框 -->
        <div
          class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 animate-dialog-show"
        >
          <!-- 标题栏 -->
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ title }}
            </h3>
            <button
              class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              @click="handleCancel"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- 内容区 -->
          <div class="px-6 py-5">
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ message }}
            </p>
          </div>

          <!-- 按钮区 -->
          <div
            class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl"
          >
            <button
              class="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 active:scale-95"
              @click="handleCancel"
            >
              {{ cancelText }}
            </button>
            <button
              class="px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-md hover:shadow-lg active:scale-95"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const visible = ref(false);
const title = ref("确认");
const message = ref("");
const confirmText = ref("确认");
const cancelText = ref("取消");

let resolvePromise: ((value: boolean) => void) | null = null;

// 显示确认对话框
const show = (options: {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}): Promise<boolean> => {
  return new Promise((resolve) => {
    title.value = options.title || "确认";
    message.value = options.message;
    confirmText.value = options.confirmText || "确认";
    cancelText.value = options.cancelText || "取消";
    resolvePromise = resolve;
    visible.value = true;
  });
};

// 确认
const handleConfirm = () => {
  visible.value = false;
  if (resolvePromise) {
    resolvePromise(true);
    resolvePromise = null;
  }
};

// 取消
const handleCancel = () => {
  visible.value = false;
  if (resolvePromise) {
    resolvePromise(false);
    resolvePromise = null;
  }
};

// 暴露给外部使用
defineExpose({
  show,
});
</script>

<style>
/* 对话框淡入淡出动画 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

/* 对话框显示动画 */
@keyframes dialog-show {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-dialog-show {
  animation: dialog-show 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
