import { ref } from "vue";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  duration?: number;
}

const notifications = ref<Notification[]>([]);
let componentInstance: any = null;

// 设置组件实例引用
export function setNotificationInstance(instance: any) {
  componentInstance = instance;
}

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 添加通知
export function addNotification(options: Omit<Notification, "id">) {
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
      removeNotification(id);
    }, notification.duration);
  }

  return id;
}

// 移除通知
export function removeNotification(id: string) {
  const index = notifications.value.findIndex((n) => n.id === id);
  if (index !== -1) {
    notifications.value.splice(index, 1);
  }
}

// 便捷方法
export function notifySuccess(
  message: string,
  title?: string,
  duration?: number
) {
  addNotification({ type: "success", message, title, duration });
}

export function notifyError(
  message: string,
  title?: string,
  duration?: number
) {
  addNotification({
    type: "error",
    message,
    title,
    duration: duration ?? 5000,
  });
}

export function notifyWarning(
  message: string,
  title?: string,
  duration?: number
) {
  addNotification({
    type: "warning",
    message,
    title,
    duration: duration ?? 4000,
  });
}

export function notifyInfo(message: string, title?: string, duration?: number) {
  addNotification({ type: "info", message, title, duration });
}

export { notifications };
