import { defineStore } from "pinia";

export const useEditorStore = defineStore("editor", {
  state: () => ({
    // Markdown内容
    content: "",
    // 光标位置
    cursorPosition: { start: 0, end: 0 },
    // 撤销栈
    history: [] as string[],
    // 重做栈
    redoStack: [] as string[],
    // 最大历史记录数
    maxHistory: 50,
    // 是否正在编辑
    isDirty: false,
    // 最后保存时间
    lastSaved: null as Date | null,
  }),

  getters: {
    // 字数统计
    wordCount: (state) => {
      if (!state.content) return { chars: 0, words: 0, lines: 0 };
      return {
        chars: state.content.length,
        words: state.content
          .trim()
          .split(/\s+/)
          .filter((w) => w.length > 0).length,
        lines: state.content.split("\n").length,
      };
    },

    // 是否可以撤销
    canUndo: (state) => state.history.length > 0,

    // 是否可以重做
    canRedo: (state) => state.redoStack.length > 0,
  },

  actions: {
    // 更新内容
    updateContent(content: string) {
      this.history.push(this.content);
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }
      this.redoStack = [];
      this.content = content;
      this.isDirty = true;
    },

    // 撤销
    undo() {
      if (this.history.length > 0) {
        this.redoStack.push(this.content);
        this.content = this.history.pop()!;
        this.isDirty = true;
      }
    },

    // 重做
    redo() {
      if (this.redoStack.length > 0) {
        this.history.push(this.content);
        this.content = this.redoStack.pop()!;
        this.isDirty = true;
      }
    },

    // 在光标位置插入文本
    insertText(text: string, before = "", after = "") {
      const textarea = document.querySelector(
        "textarea"
      ) as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = this.content.substring(start, end);

      const newText = before + (selectedText || text) + after;
      this.content =
        this.content.substring(0, start) +
        newText +
        this.content.substring(end);

      // 设置新的光标位置
      this.cursorPosition.start = start + before.length;
      this.cursorPosition.end =
        start + before.length + (selectedText || text).length;

      this.isDirty = true;
    },

    // 加载文件内容
    loadFile(file: File) {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          this.content = content;
          this.history = [];
          this.redoStack = [];
          this.isDirty = false;
          resolve(content);
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    },
  },

  // 使用 pinia-plugin-persistedstate 自动持久化
  persist: {
    key: "md-viewer-editor",
    storage: typeof window !== "undefined" ? localStorage : undefined,
    pick: ["content"],
  },
});
