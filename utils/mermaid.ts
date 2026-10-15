// Mermaid 图表客户端渲染：将 markdown.ts 生成的 .mermaid-block 占位块渲染为 SVG
import { t } from "~/i18n";

type MermaidTheme = "default" | "dark";

type Mermaid = (typeof import("mermaid"))["default"];

let mermaidPromise: Promise<Mermaid> | null = null;
let renderSeq = 0;

const loadMermaid = () => {
  // 动态加载，避免 SSR 阶段引入浏览器端依赖
  mermaidPromise ??= import("mermaid").then((m) => m.default);
  return mermaidPromise;
};

// 缩放范围与步长（zoom 写入 svg style，布局感知，放大后容器可横向滚动）
const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;

const clampScale = (value: number) =>
  Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));

const buildToolbar = (): HTMLElement => {
  const bar = document.createElement("div");
  bar.className = "mermaid-toolbar";
  bar.innerHTML = `
    <button type="button" data-mermaid-zoom="out" title="${t("mermaid.zoomOut")}">−</button>
    <span data-mermaid-scale>100%</span>
    <button type="button" data-mermaid-zoom="in" title="${t("mermaid.zoomIn")}">＋</button>
    <button type="button" data-mermaid-zoom="reset" title="${t("mermaid.zoomReset")}">1:1</button>`;
  return bar;
};

const applyMermaidZoom = (block: HTMLElement, scale: number) => {
  const next = clampScale(scale);
  block.dataset.scale = String(next);
  const svg = block.querySelector("svg");
  if (svg) svg.style.zoom = String(next);
  const label = block.querySelector<HTMLElement>("[data-mermaid-scale]");
  if (label) label.textContent = `${Math.round(next * 100)}%`;
};

// 事件委托绑定在预览容器上：图表块被 v-html 重建后无需重新绑定
export const setupMermaidZoom = (container: HTMLElement): (() => void) => {
  if (container.dataset.zoomBound) return () => {};
  container.dataset.zoomBound = "true";

  const onClick = (e: Event) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>(
      "[data-mermaid-zoom]",
    );
    if (!btn) return;
    const block = btn.closest<HTMLElement>(".mermaid-block");
    if (!block) return;

    const current = Number(block.dataset.scale ?? 1);
    // data-mermaid-zoom 对应的 dataset 键是 mermaidZoom
    const action = btn.dataset.mermaidZoom;
    const next =
      action === "in"
        ? current + SCALE_STEP
        : action === "out"
          ? current - SCALE_STEP
          : 1;
    applyMermaidZoom(block, next);
  };

  container.addEventListener("click", onClick);
  return () => {
    container.removeEventListener("click", onClick);
    delete container.dataset.zoomBound;
  };
};

export const renderMermaidDiagrams = async (
  container: HTMLElement,
  theme: MermaidTheme,
) => {
  const blocks = [...container.querySelectorAll<HTMLElement>(".mermaid-block")];
  if (blocks.length === 0) return;

  // 主题变化时，用占位块上保存的源码重建节点，触发重新渲染
  for (const block of blocks) {
    if (block.dataset.renderedTheme && block.dataset.renderedTheme !== theme) {
      delete block.dataset.renderedTheme;
      const pre = document.createElement("pre");
      pre.className = "mermaid";
      pre.textContent = block.dataset.source ?? "";
      block.replaceChildren(pre);
    }
  }

  const pending = blocks
    .filter((b) => !b.dataset.renderedTheme)
    .flatMap((b) => [...b.querySelectorAll<HTMLElement>("pre.mermaid")]);
  if (pending.length === 0) return;

  const mermaid = await loadMermaid();
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme,
  });

  for (const node of pending) {
    const block = node.closest<HTMLElement>(".mermaid-block");
    try {
      const { svg } = await mermaid.render(
        `mermaid-${++renderSeq}`,
        node.textContent ?? "",
      );
      if (block) {
        block.innerHTML = svg;
        block.dataset.renderedTheme = theme;
        block.appendChild(buildToolbar());
        // 重渲染（如主题切换）后恢复已有缩放
        applyMermaidZoom(block, Number(block.dataset.scale ?? 1));
      }
    } catch {
      // 语法错误：保留源码展示，标记错误样式
      node.dataset.error = "true";
    }
  }
};
