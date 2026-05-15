/**
 * 全局通知工具函数
 * 用于替换浏览器原生 alert/confirm
 */

// 用于跟踪当前活跃的通知，防止重复弹出
const activeNotifications = new Set<string>();

// 生成通知的唯一标识（基于内容和类型）
const getNotificationKey = (message: string, type: string) => {
  return `${type}:${message}`;
};

// 简单的通知样式
const createNotification = (
  message: string,
  type: "success" | "error" | "warning" | "info" = "info",
  duration: number = 3000
) => {
  if (typeof window === "undefined") return;

  // 检查是否已存在相同内容的通知
  const key = getNotificationKey(message, type);
  if (activeNotifications.has(key)) {
    return; // 已存在相同通知，不重复弹出
  }

  // 创建通知容器
  const container = document.createElement("div");
  container.className =
    "fixed top-4 right-4 z-[9999] max-w-sm notification-enter";

  // 颜色映射
  const colors = {
    success: {
      bg: "bg-green-50 dark:bg-green-900/95",
      border: "border-green-200 dark:border-green-700",
      icon: "text-green-600 dark:text-green-400",
      text: "text-green-800 dark:text-green-200",
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/95",
      border: "border-red-200 dark:border-red-700",
      icon: "text-red-600 dark:text-red-400",
      text: "text-red-800 dark:text-red-200",
    },
    warning: {
      bg: "bg-yellow-50 dark:bg-yellow-900/95",
      border: "border-yellow-200 dark:border-yellow-700",
      icon: "text-yellow-600 dark:text-yellow-400",
      text: "text-yellow-800 dark:text-yellow-200",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/95",
      border: "border-blue-200 dark:border-blue-700",
      icon: "text-blue-600 dark:text-blue-400",
      text: "text-blue-800 dark:text-blue-200",
    },
  };

  const color = colors[type];

  // 创建通知内容
  container.innerHTML = `
    <div class="flex items-start gap-3 p-4 rounded-xl shadow-large border backdrop-blur-xl ${
      color.bg
    } ${color.border}">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5 ${
          color.icon
        }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${
            type === "success"
              ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>'
              : ""
          }
          ${
            type === "error"
              ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m10-8a9 9 0 11-18 0 9 9 0 0118 0z"/>'
              : ""
          }
          ${
            type === "warning"
              ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>'
              : ""
          }
          ${
            type === "info"
              ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
              : ""
          }
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm ${color.text}">${message}</p>
      </div>
      <button class="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 notification-close-btn">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  `;

  // 标记为活跃
  activeNotifications.add(key);

  document.body.appendChild(container);

  // 手动关闭按钮事件处理
  const closeBtn = container.querySelector(".notification-close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      // 手动关闭时也要清理记录
      container.classList.remove("notification-enter");
      container.classList.add("notification-exit");
      setTimeout(() => {
        container.remove();
        activeNotifications.delete(key);
      }, 300);
    });
  }

  // 自动移除
  if (duration > 0) {
    setTimeout(() => {
      if (container.parentElement) {
        container.classList.remove("notification-enter");
        container.classList.add("notification-exit");
        setTimeout(() => {
          container.remove();
          // 从活跃集合中移除
          activeNotifications.delete(key);
        }, 300);
      }
    }, duration);
  }
};

// 便捷方法
export function notifySuccess(message: string, duration?: number) {
  createNotification(message, "success", duration);
}

export function notifyError(message: string, duration?: number) {
  createNotification(message, "error", duration ?? 5000);
}

export function notifyWarning(message: string, duration?: number) {
  createNotification(message, "warning", duration ?? 4000);
}

export function notifyInfo(message: string, duration?: number) {
  createNotification(message, "info", duration);
}
