<template>
  <div>
    <NuxtPage />
    <!-- 全局通知组件 -->
    <Notification ref="notificationRef" />
    <!-- 全局确认对话框 -->
    <ConfirmDialog ref="confirmDialogRef" />
  </div>
</template>

<script setup lang="ts">
import {
  setNotificationInstance,
  notifications,
} from "~/composables/useNotification";
import { setConfirmDialogInstance } from "~/composables/useConfirmDialog";

const notificationRef = ref<any>(null);
const confirmDialogRef = ref<any>(null);

// 设置组件实例引用，使 composable 能够控制组件
watch(
  notificationRef,
  (instance) => {
    if (instance) {
      setNotificationInstance(instance);
    }
  },
  { immediate: true }
);

// 将通知列表同步到组件
watch(
  notifications,
  (newNotifications) => {
    if (notificationRef.value) {
      notificationRef.value.notifications = newNotifications;
    }
  },
  { deep: true }
);

// 设置确认对话框实例引用
watch(
  confirmDialogRef,
  (instance) => {
    if (instance) {
      setConfirmDialogInstance(instance);
    }
  },
  { immediate: true }
);
</script>

<style>
/* 全局样式已在assets/css/main.css中定义 */
</style>
