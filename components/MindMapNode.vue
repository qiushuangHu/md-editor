<template>
  <div class="mindmap-node-wrapper" :class="nodeClass">
    <Handle
      type="target"
      :position="Position.Left"
      class="mindmap-handle"
      :connectable="false"
    />
    <div class="mindmap-node-content" :title="data.label">
      <span class="mindmap-node-label">{{ data.label }}</span>
    </div>
    <Handle
      type="source"
      :position="Position.Right"
      class="mindmap-handle"
      :connectable="false"
    />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
import type { NodeProps } from "@vue-flow/core";

interface MindMapNodeData {
  label: string;
  level: number;
  isRoot?: boolean;
}

const props = defineProps<NodeProps<MindMapNodeData>>();

const data = computed(() => props.data ?? { label: "", level: 0 });

const nodeClass = computed(() => {
  const level = data.value.level;
  if (data.value.isRoot || level === 0) return "mindmap-node--root";
  if (level === 1) return "mindmap-node--h1";
  if (level === 2) return "mindmap-node--h2";
  if (level === 3) return "mindmap-node--h3";
  return "mindmap-node--leaf";
});
</script>

<style scoped>
.mindmap-node-wrapper {
  font-family: inherit;
  transition: box-shadow 0.2s ease, transform 0.15s ease;
}
.mindmap-node-wrapper:hover {
  transform: translateY(-1px);
}

.mindmap-node-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 12px;
  overflow: hidden;
}

.mindmap-node-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
  line-height: 1.3;
}

.mindmap-handle {
  width: 6px;
  height: 6px;
  background: #93c5fd;
  border: 1.5px solid #3b82f6;
  opacity: 0;
  transition: opacity 0.2s;
}
.mindmap-node-wrapper:hover .mindmap-handle {
  opacity: 1;
}

/* ── 根节点 (level 0) ── */
.mindmap-node--root {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 14px;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  border: none;
}
.mindmap-node--root .mindmap-node-label {
  letter-spacing: 0.02em;
}

/* ── H1 节点 ── */
.mindmap-node--h1 {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
  color: #ffffff;
  font-weight: 600;
  font-size: 13px;
  border: none;
}

/* ── H2 节点 ── */
.mindmap-node--h2 {
  background: #eff6ff;
  border: 1.5px solid #93c5fd;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(59, 130, 246, 0.12);
  color: #1d4ed8;
  font-weight: 500;
  font-size: 12.5px;
}

/* ── H3 节点 ── */
.mindmap-node--h3 {
  background: #ffffff;
  border: 1.5px solid #bfdbfe;
  border-radius: 7px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  color: #374151;
  font-weight: 400;
  font-size: 12px;
}

/* ── 叶子节点 (H4+) ── */
.mindmap-node--leaf {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #6b7280;
  font-weight: 400;
  font-size: 11.5px;
}

/* ── 暗色模式 ── */
:global(.dark) .mindmap-node--root {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.5);
  color: #eff6ff;
}
:global(.dark) .mindmap-node--h1 {
  background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  color: #eff6ff;
}
:global(.dark) .mindmap-node--h2 {
  background: #1e3a5f;
  border-color: #2563eb;
  color: #93c5fd;
}
:global(.dark) .mindmap-node--h3 {
  background: #1f2937;
  border-color: #374151;
  color: #d1d5db;
}
:global(.dark) .mindmap-node--leaf {
  background: #111827;
  border-color: #374151;
  color: #9ca3af;
}
</style>
