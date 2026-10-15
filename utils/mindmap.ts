import dagre from "@dagrejs/dagre";
import type { Node, Edge } from "@vue-flow/core";
import { Position } from "@vue-flow/core";
import { t } from "~/i18n";

/** 思维导图节点数据 */
interface MindMapNodeData {
  label: string;
  level: number;
  isRoot?: boolean;
  [key: string]: any;
}

/** 节点尺寸配置（按层级递减） */
const NODE_DIMENSIONS: Record<number, { width: number; height: number }> = {
  0: { width: 180, height: 56 }, // 根节点
  1: { width: 160, height: 44 }, // H1
  2: { width: 150, height: 40 }, // H2
  3: { width: 140, height: 36 }, // H3
  4: { width: 130, height: 34 }, // H4+
};

const getDimension = (level: number) =>
  NODE_DIMENSIONS[level] || NODE_DIMENSIONS[4]!;

/**
 * 从 Markdown 内容解析出思维导图的节点和边
 * @param content Markdown 原始内容
 * @param maxLevel 最大显示层级 (1-6)，默认 3
 */
export function parseMarkdownToMindMap(
  content: string,
  maxLevel: number = 3,
): { nodes: Node<MindMapNodeData>[]; edges: Edge[] } {
  if (!content?.trim()) return { nodes: [], edges: [] };

  const lines = content.split("\n");
  const nodes: Node<MindMapNodeData>[] = [];
  const edges: Edge[] = [];

  // 用栈来追踪当前各层级的父节点
  const stack: { id: string; level: number }[] = [];
  let nodeIndex = 0;
  let hasRoot = false;

  // 尝试获取文件名作为根节点（从第一行 H1 或第一个标题）
  let rootLabel = t("mindmap.rootLabel");
  const firstH1 = lines.find((l) => /^#\s+/.test(l.trim()));
  if (firstH1) {
    rootLabel = firstH1.replace(/^#\s+/, "").trim();
  }

  // 添加根节点
  const rootId = "root";
  nodes.push({
    id: rootId,
    type: "mindmap",
    position: { x: 0, y: 0 },
    data: {
      label: rootLabel,
      level: 0,
      isRoot: true,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });
  hasRoot = true;
  stack.push({ id: rootId, level: 0 });

  // 跳过第一行 H1（已用作根节点）
  let skipFirstH1 = !!firstH1;

  for (const line of lines) {
    const trimmed = line.trim();

    // 匹配标题
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1]!.length;
      const text = headingMatch[2]!.trim();

      // 跳过第一个 H1（已作为根节点）
      if (level === 1 && skipFirstH1) {
        skipFirstH1 = false;
        continue;
      }

      // 层级过滤
      if (level > maxLevel) continue;

      const nodeId = `node-${nodeIndex++}`;
      nodes.push({
        id: nodeId,
        type: "mindmap",
        position: { x: 0, y: 0 },
        data: {
          label: text,
          level,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });

      // 在栈中找到合适的父节点（层级比当前小的最近节点）
      while (stack.length > 1 && stack[stack.length - 1]!.level >= level) {
        stack.pop();
      }

      const parentId = stack[stack.length - 1]!.id;
      edges.push({
        id: `edge-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: "smoothstep",
        animated: false,
      });

      stack.push({ id: nodeId, level });
      continue;
    }

    // 匹配列表项（- 或 * 或数字列表）
    const listMatch =
      trimmed.match(/^[-*]\s+(.+)$/) || trimmed.match(/^\d+\.\s+(.+)$/);
    if (listMatch && stack.length > 0) {
      const text = listMatch[1]!.trim();
      if (!text) continue;

      // 列表项作为当前栈顶节点的子节点，层级设为 maxLevel+1 以便过滤
      const listLevel = (stack[stack.length - 1]!.level || 0) + 1;
      if (listLevel > maxLevel) continue;

      const nodeId = `node-${nodeIndex++}`;
      nodes.push({
        id: nodeId,
        type: "mindmap",
        position: { x: 0, y: 0 },
        data: {
          label: text,
          level: listLevel,
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });

      const parentId = stack[stack.length - 1]!.id;
      edges.push({
        id: `edge-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: "smoothstep",
      });
    }
  }

  // 如果只有根节点，没有子内容，返回空
  if (nodes.length <= 1 && !hasRoot) {
    return { nodes: [], edges: [] };
  }

  // 使用 dagre 自动布局
  return applyDagreLayout(nodes, edges);
}

/**
 * 使用 dagre 对节点进行自动布局
 */
function applyDagreLayout(
  nodes: Node<MindMapNodeData>[],
  edges: Edge[],
): { nodes: Node<MindMapNodeData>[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "LR", // 从左到右布局
    nodesep: 20, // 同层节点间距
    ranksep: 80, // 层级间距
    marginx: 40,
    marginy: 40,
  });

  // 设置节点尺寸
  for (const node of nodes) {
    const dim = getDimension(node.data?.level ?? 0);
    g.setNode(node.id, { width: dim.width, height: dim.height });
  }

  // 设置边
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  // 执行布局
  dagre.layout(g);

  // 应用布局结果
  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    const dim = getDimension(node.data?.level ?? 0);
    return {
      ...node,
      position: {
        x: (pos?.x || 0) - dim.width / 2,
        y: (pos?.y || 0) - dim.height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
