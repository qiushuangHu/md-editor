import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    // 主题：'light' | 'dark' | 'eye-care'
    theme: "light",
    // 布局模式：'split' | 'editor-only' | 'preview-only'
    layout: "split",
    // 分栏方向：'horizontal' | 'vertical'
    splitDirection: "horizontal",
    // 字体大小
    fontSize: 14,
    // 行高
    lineHeight: 1.6,
    // 是否同步滚动
    syncScroll: true,
    // 文件名
    fileName: "untitled.md",
    // 是否显示TOC
    showToc: false,
    // 是否显示工具栏
    showToolbar: true,
  }),

  getters: {
    // 是否为暗色主题
    isDark: (state) => state.theme === "dark",
    // 是否为护眼模式
    isEyeCare: (state) => state.theme === "eye-care",
  },

  actions: {
    // 切换主题
    toggleTheme() {
      const themes = ["light", "dark", "eye-care"];
      const currentIndex = themes.indexOf(this.theme);
      this.theme = themes[(currentIndex + 1) % themes.length];
      this.applyTheme();
    },

    // 应用主题
    applyTheme() {
      if (process.client) {
        const html = document.documentElement;
        html.classList.remove("dark");

        if (this.theme === "dark") {
          html.classList.add("dark");
          html.style.backgroundColor = "";
        } else if (this.theme === "eye-care") {
          html.style.backgroundColor = "#f5f5dc";
        } else {
          html.style.backgroundColor = "";
        }
      }
    },

    // 切换布局
    toggleLayout() {
      const layouts = ["split", "editor-only", "preview-only"];
      const currentIndex = layouts.indexOf(this.layout);
      this.layout = layouts[(currentIndex + 1) % layouts.length];
    },

    // 切换分栏方向
    toggleSplitDirection() {
      this.splitDirection =
        this.splitDirection === "horizontal" ? "vertical" : "horizontal";
    },
  },

  // 使用 pinia-plugin-persistedstate 自动持久化
  persist: {
    key: "md-viewer-settings",
    storage: typeof window !== "undefined" ? localStorage : undefined,
    pick: [
      "theme",
      "layout",
      "splitDirection",
      "fontSize",
      "lineHeight",
      "syncScroll",
      "showToc",
      "showToolbar",
      "fileName",
    ],
  },
});
