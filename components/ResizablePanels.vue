<template>
  <div
    ref="containerRef"
    class="resizable-panels w-full h-full flex flex-row"
    :class="{ 'select-none': isDragging }"
  >
    <template v-for="(panel, index) in panels" :key="panel.name">
      <div
        v-show="panel.visible !== false"
        class="resizable-panel h-full overflow-hidden flex-shrink-0"
        :style="{ width: getPanelWidth(index) }"
        :data-panel="panel.name"
      >
        <slot :name="panel.name"></slot>
      </div>
      <div
        v-if="hasVisiblePanelAfter(index) && panel.visible !== false"
        class="resizable-handle flex-shrink-0 w-1 cursor-col-resize relative group z-10"
        :class="isDragging && activeHandle === index ? 'bg-primary-500' : ''"
        @mousedown.prevent="
          startDrag($event, index, getNextVisibleIndex(index))
        "
        @dblclick="resetPanelWidth(index, getNextVisibleIndex(index))"
      >
        <div
          class="absolute inset-y-0 -left-1 -right-1 group-hover:bg-primary-500/30 transition-colors"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-primary-500 transition-colors opacity-0 group-hover:opacity-100"
        ></div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
export interface PanelConfig {
  name: string;
  minWidth: number;
  defaultWidth?: number;
  visible?: boolean;
}

interface Props {
  panels: PanelConfig[];
  widths?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  widths: () => [],
});

const emit = defineEmits<{
  (e: "update:widths", widths: number[]): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const activeHandle = ref<number>(-1);
const panelWidths = ref<number[]>([]);

const getVisiblePanels = () => {
  return props.panels
    .map((p, i) => ({ ...p, index: i }))
    .filter((p) => p.visible !== false);
};

// 防止 widths watcher 在可见性切换时覆盖 recalculated 的宽度
let skipWidthsWatcher = false;

const calcDefaultWidths = (containerWidth: number): number[] => {
  const visiblePanels = getVisiblePanels();
  if (visiblePanels.length === 0) return new Array(props.panels.length).fill(0);

  const widths = new Array(props.panels.length).fill(0);

  // 有 defaultWidth 的面板使用固定宽度（如 TOC=300），其余面板平分剩余空间
  let fixedWidth = 0;
  const flexPanels: typeof visiblePanels = [];

  visiblePanels.forEach((p) => {
    if (p.defaultWidth) {
      widths[p.index] = p.defaultWidth;
      fixedWidth += p.defaultWidth;
    } else {
      flexPanels.push(p);
    }
  });

  if (flexPanels.length > 0) {
    const remaining = Math.max(
      containerWidth - fixedWidth,
      flexPanels.length * 200
    );
    const w = remaining / flexPanels.length;
    flexPanels.forEach((p) => {
      widths[p.index] = Math.max(w, p.minWidth || 100);
    });
  }

  return widths;
};

const initWidths = (keepExisting = false) => {
  const containerWidth = containerRef.value?.clientWidth || 1200;
  const visiblePanels = getVisiblePanels();
  if (visiblePanels.length === 0) return;

  let widths: number[];

  if (keepExisting) {
    // 可见性切换：始终恢复为默认布局（TOC 固定宽度，其余平分）
    widths = calcDefaultWidths(containerWidth);
  } else {
    // 首次初始化：优先使用持久化的存储宽度
    const hasValidStored =
      props.widths.length === props.panels.length &&
      props.widths.some((w) => w > 0);

    if (hasValidStored) {
      widths = new Array(props.panels.length).fill(0);
      let allValid = true;

      visiblePanels.forEach((p) => {
        const stored = props.widths[p.index] || 0;
        if (stored >= (p.minWidth || 100)) {
          widths[p.index] = stored;
        } else {
          allValid = false;
        }
      });

      // 存储宽度不完整时，回退到默认布局
      if (!allValid) {
        widths = calcDefaultWidths(containerWidth);
      }
    } else {
      widths = calcDefaultWidths(containerWidth);
    }
  }

  skipWidthsWatcher = true;
  panelWidths.value = widths;
  // 同步更新本地缓存
  emit("update:widths", [...widths]);
  nextTick(() => {
    skipWidthsWatcher = false;
  });
};

const getPanelWidth = (index: number): string => {
  if (props.panels[index]?.visible === false) return "0px";
  return `${panelWidths.value[index] || 0}px`;
};

const hasVisiblePanelAfter = (index: number): boolean => {
  for (let i = index + 1; i < props.panels.length; i++) {
    if (props.panels[i]?.visible !== false) return true;
  }
  return false;
};

const getNextVisibleIndex = (index: number): number => {
  for (let i = index + 1; i < props.panels.length; i++) {
    if (props.panels[i]?.visible !== false) return i;
  }
  return -1;
};

let startX = 0;
let startLeftWidth = 0;
let startRightWidth = 0;
let rightPanelIndex = -1;

const startDrag = (e: MouseEvent, leftIndex: number, rIndex: number) => {
  if (rIndex < 0) return;
  const leftPanel = props.panels[leftIndex];
  const rPanel = props.panels[rIndex];
  if (!leftPanel || !rPanel) return;

  isDragging.value = true;
  activeHandle.value = leftIndex;
  rightPanelIndex = rIndex;
  startX = e.clientX;
  startLeftWidth = panelWidths.value[leftIndex] || 0;
  startRightWidth = panelWidths.value[rIndex] || 0;

  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;

  const delta = e.clientX - startX;
  const leftPanel = props.panels[activeHandle.value];
  const rPanel = props.panels[rightPanelIndex];
  if (!leftPanel || !rPanel) return;

  const leftMin = leftPanel.minWidth || 100;
  const rightMin = rPanel.minWidth || 100;

  let newLeft = startLeftWidth + delta;
  let newRight = startRightWidth - delta;

  if (newLeft < leftMin) {
    newLeft = leftMin;
    newRight = startLeftWidth + startRightWidth - leftMin;
  }
  if (newRight < rightMin) {
    newRight = rightMin;
    newLeft = startLeftWidth + startRightWidth - rightMin;
  }

  panelWidths.value[activeHandle.value] = newLeft;
  panelWidths.value[rightPanelIndex] = newRight;
};

const stopDrag = () => {
  isDragging.value = false;
  activeHandle.value = -1;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
  emit("update:widths", [...panelWidths.value]);
};

const resetPanelWidth = (leftIndex: number, rIndex: number) => {
  if (rIndex < 0) return;
  const leftPanel = props.panels[leftIndex];
  const rPanel = props.panels[rIndex];
  if (!leftPanel || !rPanel) return;

  const totalWidth =
    (panelWidths.value[leftIndex] || 0) + (panelWidths.value[rIndex] || 0);
  const leftDefault = leftPanel.defaultWidth || totalWidth / 2;
  const rightDefault = rPanel.defaultWidth || totalWidth / 2;
  const ratio = totalWidth / (leftDefault + rightDefault);

  panelWidths.value[leftIndex] = Math.max(
    leftDefault * ratio,
    leftPanel.minWidth || 100
  );
  panelWidths.value[rIndex] = Math.max(
    rightDefault * ratio,
    rPanel.minWidth || 100
  );
  emit("update:widths", [...panelWidths.value]);
};

// 监听面板可见性变化，重新初始化宽度
watch(
  () => props.panels.map((p) => p.visible),
  () => {
    nextTick(() => {
      initWidths(true);
    });
  },
  { deep: true }
);

// 监听外部 widths 变化
watch(
  () => props.widths,
  (newWidths) => {
    if (skipWidthsWatcher) return;
    if (
      newWidths.length === props.panels.length &&
      newWidths.some((w) => w > 0)
    ) {
      panelWidths.value = [...newWidths];
    }
  },
  { deep: true }
);

onMounted(() => {
  nextTick(() => {
    initWidths(false);
  });
});

onUnmounted(() => {
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
});
</script>
