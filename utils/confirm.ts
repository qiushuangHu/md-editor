/**
 * 确认对话框工具函数
 * 用于替换浏览器原生 confirm
 */

import { showConfirm as _showConfirm } from "~/composables/useConfirmDialog";

/**
 * 显示确认对话框
 * @param options 配置选项
 * @returns Promise<boolean> - 用户点击确认返回 true，取消返回 false
 */
export function showConfirm(options: {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}): Promise<boolean> {
  return _showConfirm(options);
}
