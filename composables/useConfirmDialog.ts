/**
 * 全局确认对话框管理
 */
import { ref } from "vue";

const confirmDialogInstance = ref<any>(null);

// 设置组件实例引用
export function setConfirmDialogInstance(instance: any) {
  confirmDialogInstance.value = instance;
}

// 显示确认对话框
export function showConfirm(options: {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}): Promise<boolean> {
  if (!confirmDialogInstance.value) {
    console.error("ConfirmDialog 组件未初始化");
    return Promise.resolve(false);
  }
  return confirmDialogInstance.value.show(options);
}
