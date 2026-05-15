<template>
  <Teleport to="body">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="fixed top-4 right-4 z-[9999] max-w-sm"
      >
        <div
          class="flex items-start gap-3 p-4 rounded-xl shadow-large border backdrop-blur-xl transition-all"
          :class="[
            notification.type === 'success'
              ? 'bg-green-50/95 dark:bg-green-900/95 border-green-200 dark:border-green-700'
              : notification.type === 'error'
              ? 'bg-red-50/95 dark:bg-red-900/95 border-red-200 dark:border-red-700'
              : notification.type === 'warning'
              ? 'bg-yellow-50/95 dark:bg-yellow-900/95 border-yellow-200 dark:border-yellow-700'
              : 'bg-blue-50/95 dark:bg-blue-900/95 border-blue-200 dark:border-blue-700',
          ]"
        >
          <!-- 图标 -->
          <div class="flex-shrink-0">
            <svg
              v-if="notification.type === 'success'"
              class="w-5 h-5 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <svg
              v-else-if="notification.type === 'error'"
              class="w-5 h-5 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-6 6l-2-2m0 0l-2 2m10-8a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <svg
              v-else-if="notification.type === 'warning'"
              class="w-5 h-5 text-yellow-600 dark:text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <!-- 内容 -->
          <div class="flex-1 min-w-0">
            <p
              v-if="notification.title"
              class="text-sm font-semibold mb-1"
              :class="[
                notification.type === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : notification.type === 'error'
                  ? 'text-red-800 dark:text-red-200'
                  : notification.type === 'warning'
                  ? 'text-yellow-800 dark:text-yellow-200'
                  : 'text-blue-800 dark:text-blue-200',
              ]"
            >
              {{ notification.title }}
            </p>
            <p
              class="text-sm"
              :class="[
                notification.type === 'success'
                  ? 'text-green-700 dark:text-green-300'
                  : notification.type === 'error'
                  ? 'text-red-700 dark:text-red-300'
                  : notification.type === 'warning'
                  ? 'text-yellow-700 dark:text-yellow-300'
                  : 'text-blue-700 dark:text-blue-300',
              ]"
            >
              {{ notification.message }}
            </p>
          </div>

          <!-- 关闭按钮 -->
          <button
            class="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            @click="remove(notification.id)"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
}

const notifications = ref<Notification[]>([]);

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 添加通知
const add = (options: Omit<Notification, "id">) => {
  const id = generateId();
  const notification: Notification = {
    id,
    duration: 3000,
    ...options,
  };

  notifications.value.push(notification);

  // 自动移除
  if (notification.duration && notification.duration > 0) {
    setTimeout(() => {
      remove(id);
    }, notification.duration);
  }

  return id;
};

// 移除通知
const remove = (id: string) => {
  const index = notifications.value.findIndex((n) => n.id === id);
  if (index !== -1) {
    notifications.value.splice(index, 1);
  }
};

// 便捷方法
const success = (message: string, title?: string, duration?: number) => {
  return add({ type: "success", message, title, duration });
};

const error = (message: string, title?: string, duration?: number) => {
  return add({ type: "error", message, title, duration: duration ?? 5000 });
};

const warning = (message: string, title?: string, duration?: number) => {
  return add({ type: "warning", message, title, duration: duration ?? 4000 });
};

const info = (message: string, title?: string, duration?: number) => {
  return add({ type: "info", message, title, duration });
};

// 暴露方法供全局使用
defineExpose({
  add,
  remove,
  success,
  error,
  warning,
  info,
});
</script>

<style scoped>
/* 通知动画 */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.2s ease-in;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
