<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="handleClose"
        @keydown.esc="handleClose"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-large border border-gray-200 dark:border-gray-700 w-[95vw] h-[90vh] flex flex-col overflow-hidden"
        >
          <!-- 顶部栏 -->
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-5 py-3 flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm"
              >
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2
                class="text-base font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent"
              >
                {{ t("mindmap.title") }}
              </h2>
            </div>

            <div class="flex items-center gap-3">
              <!-- 层级选择器 -->
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ t("mindmap.levelLabel") }}
                </span>
                <div class="flex gap-1">
                  <button
                    v-for="lvl in [2, 3, 4, 5]"
                    :key="lvl"
                    class="px-2 py-1 text-xs rounded-md transition-all duration-200 cursor-pointer active:scale-95"
                    :class="
                      currentLevel === lvl
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-soft'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600'
                    "
                    @click="currentLevel = lvl"
                  >
                    H{{ lvl }}
                  </button>
                </div>
              </div>

              <div class="w-px h-5 bg-gray-200 dark:bg-gray-700"></div>

              <!-- 适配视图 -->
              <button
                class="btn-icon"
                :title="t('mindmap.fitView')"
                @click="fitViewToNodes"
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
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              </button>

              <!-- 关闭按钮 -->
              <button
                class="p-2 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 active:scale-95"
                :title="t('mindmap.close')"
                @click="handleClose"
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
          </div>

          <!-- Vue Flow 画布 -->
          <div class="flex-1 relative overflow-hidden">
            <div
              v-if="nodes.length === 0"
              class="flex items-center justify-center h-full"
            >
              <div class="text-center text-gray-400 dark:text-gray-500">
                <svg
                  class="w-16 h-16 mx-auto mb-4 opacity-50"
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
                <p class="text-lg">{{ t("mindmap.empty") }}</p>
                <p class="text-sm mt-2 opacity-75">
                  {{ t("mindmap.emptyHint") }}
                </p>
              </div>
            </div>

            <VueFlow
              v-else
              :nodes="nodes"
              :edges="edges"
              :node-types="nodeTypes"
              :edge-types="edgeTypes"
              :default-edge-options="defaultEdgeOptions"
              :fit-view-on-init="true"
              :min-zoom="0.2"
              :max-zoom="2"
              :pan-on-drag="true"
              :zoom-on-scroll="true"
              :zoom-on-pinch="true"
              class="mindmap-flow"
              ref="vueFlowRef"
            >
              <Background :gap="20" :size="1" />
              <Controls class="mindmap-controls" :show-interactive="false" />
              <MiniMap
                :zoomable="true"
                :pannable="true"
                class="mindmap-minimap"
              />
            </VueFlow>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import MindMapNode from "./MindMapNode.vue";
import { parseMarkdownToMindMap } from "~/utils/mindmap";

import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import "@vue-flow/controls/dist/style.css";
import "@vue-flow/minimap/dist/style.css";

const props = defineProps<{
  visible: boolean;
  content: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { t } = useI18n();
const currentLevel = ref(3);
const vueFlowRef = ref<any>(null);

const { fitView } = useVueFlow();

// 自定义节点类型
const nodeTypes = { mindmap: markRaw(MindMapNode) };
// 自定义边类型（使用默认 smoothstep）
const edgeTypes = {};

// 默认边样式选项
const defaultEdgeOptions = {
  type: "smoothstep",
  style: { stroke: "#93c5fd", strokeWidth: 2 },
  animated: false,
};

// 解析 MD 生成节点和边
const mindMapData = computed(() => {
  if (!props.content?.trim()) return { nodes: [], edges: [] };
  return parseMarkdownToMindMap(props.content, currentLevel.value);
});

const nodes = computed(() => mindMapData.value.nodes);
const edges = computed(() => mindMapData.value.edges);

// 适配视图
const fitViewToNodes = () => {
  nextTick(() => {
    fitView({ padding: 0.2, duration: 300 });
  });
};

// 层级变化后重新适配
watch(currentLevel, () => {
  nextTick(() => {
    setTimeout(() => fitViewToNodes(), 100);
  });
});

// 弹窗打开后适配视图
watch(
  () => props.visible,
  (val) => {
    if (val) {
      nextTick(() => {
        setTimeout(() => fitViewToNodes(), 200);
      });
    }
  },
);

const handleClose = () => {
  emit("close");
};
</script>

<style>
/* Vue Flow 容器样式 */
.mindmap-flow {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.dark .mindmap-flow {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

/* 控制按钮主题适配 */
.mindmap-controls {
  border-radius: 12px !important;
  overflow: hidden;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 2px 15px -3px rgba(0, 0, 0, 0.07) !important;
}

.dark .mindmap-controls {
  border-color: #374151 !important;
}

.mindmap-controls button {
  background: white !important;
  border-color: #e2e8f0 !important;
  color: #374151 !important;
}

.dark .mindmap-controls button {
  background: #1f2937 !important;
  border-color: #374151 !important;
  color: #d1d5db !important;
}

.mindmap-controls button:hover {
  background: #eff6ff !important;
  color: #2563eb !important;
}

.dark .mindmap-controls button:hover {
  background: #1e3a8a !important;
  color: #93c5fd !important;
}

/* 小地图主题适配 */
.mindmap-minimap {
  border-radius: 12px !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 2px 15px -3px rgba(0, 0, 0, 0.07) !important;
  background: white !important;
}

.dark .mindmap-minimap {
  background: #1f2937 !important;
  border-color: #374151 !important;
}

/* 边的样式 */
.mindmap-flow .vue-flow__edge-path {
  stroke: #93c5fd;
  stroke-width: 2;
}

.dark .mindmap-flow .vue-flow__edge-path {
  stroke: #3b82f6;
  stroke-width: 2;
}

/* 选中状态 */
.mindmap-flow .vue-flow__edge.selected .vue-flow__edge-path {
  stroke: #2563eb;
  stroke-width: 3;
}
</style>
