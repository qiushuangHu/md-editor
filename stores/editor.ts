import { defineStore } from "pinia";
import type { MdFile } from "~/types/file";

export const useEditorStore = defineStore("editor", {
  state: () => ({
    // 所有打开的文件列表
    files: [] as MdFile[],
    // 当前激活的文件ID
    activeFileId: "",
  }),

  getters: {
    // 当前激活的文件
    activeFile: (state) => {
      return state.files.find((f) => f.id === state.activeFileId) || null;
    },

    // 当前文件内容
    content: (state) => {
      const activeFile = state.files.find((f) => f.id === state.activeFileId);
      return activeFile?.content || "";
    },

    // 是否为空（没有打开任何文件）
    isEmpty: (state) => state.files.length === 0,

    // 字数统计（基于当前文件）
    wordCount: (state) => {
      const activeFile = state.files.find((f) => f.id === state.activeFileId);
      if (!activeFile || !activeFile.content) {
        return { chars: 0, words: 0, lines: 0 };
      }
      return {
        chars: activeFile.content.length,
        words: activeFile.content
          .trim()
          .split(/\s+/)
          .filter((w) => w.length > 0).length,
        lines: activeFile.content.split("\n").length,
      };
    },

    // 是否可以撤销
    canUndo: (state) => {
      const activeFile = state.files.find((f) => f.id === state.activeFileId);
      return activeFile ? activeFile.history.length > 0 : false;
    },

    // 是否可以重做
    canRedo: (state) => {
      const activeFile = state.files.find((f) => f.id === state.activeFileId);
      return activeFile ? activeFile.redoStack.length > 0 : false;
    },

    // 最后保存时间（从当前文件获取）
    lastSaved: (state) => {
      const activeFile = state.files.find((f) => f.id === state.activeFileId);
      return activeFile?.lastModified || null;
    },
  },

  actions: {
    // 生成唯一ID
    generateId(): string {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // 添加新文件
    async addFile(file: File) {
      const content = await this.readFile(file);
      const newFile: MdFile = {
        id: this.generateId(),
        fileName: file.name,
        content,
        fileSize: file.size,
        lastModified: new Date(file.lastModified),
        isDirty: false,
        isImported: true,
        history: [],
        redoStack: [],
        maxHistory: 50,
      };
      this.files.push(newFile);
      this.activeFileId = newFile.id;
      return content;
    },

    // 读取文件内容
    readFile(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          resolve(content);
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    },

    // 切换文件
    switchFile(id: string) {
      const file = this.files.find((f) => f.id === id);
      if (file) {
        this.activeFileId = id;
      }
    },

    // 关闭文件
    removeFile(id: string) {
      const index = this.files.findIndex((f) => f.id === id);
      if (index === -1) return;

      this.files.splice(index, 1);

      // 如果关闭的是当前文件，切换到相邻文件
      if (id === this.activeFileId) {
        const newActiveIndex = Math.min(index, this.files.length - 1);
        this.activeFileId = this.files[newActiveIndex]?.id || "";
      }
    },

    // 关闭所有文件
    closeAllFiles() {
      this.files = [];
      this.activeFileId = "";
    },

    // 更新当前文件内容（不保存到历史，用于实时输入）
    setContent(content: string) {
      const file = this.activeFile;
      if (!file) return;

      file.content = content;
      file.isDirty = true;
    },

    // 更新当前文件内容（保存到历史，用于工具栏插入等操作）
    updateContent(content: string) {
      const file = this.activeFile;
      if (!file) return;

      file.history.push(file.content);
      if (file.history.length > file.maxHistory) {
        file.history.shift();
      }
      file.redoStack = [];
      file.content = content;
      file.isDirty = true;
    },

    // 撤销
    undo() {
      const file = this.activeFile;
      if (!file || file.history.length === 0) return;

      file.redoStack.push(file.content);
      file.content = file.history.pop()!;
      file.isDirty = true;
    },

    // 重做
    redo() {
      const file = this.activeFile;
      if (!file || file.redoStack.length === 0) return;

      file.history.push(file.content);
      file.content = file.redoStack.pop()!;
      file.isDirty = true;
    },

    // 在光标位置插入文本
    insertText(text: string, before = "", after = "") {
      const textarea = document.querySelector(
        "textarea"
      ) as HTMLTextAreaElement;
      if (!textarea) return;

      const file = this.activeFile;
      if (!file) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = file.content.substring(start, end);

      const newText = before + (selectedText || text) + after;
      file.content =
        file.content.substring(0, start) +
        newText +
        file.content.substring(end);

      // 设置新的光标位置
      file.cursorPosition = {
        start: start + before.length,
        end: start + before.length + (selectedText || text).length,
      };

      file.isDirty = true;
    },

    // 加载文件内容（兼容旧API，用于拖拽上传）
    loadFile(file: File): Promise<string> {
      return this.addFile(file);
    },

    // 保存当前文件
    saveCurrentFile() {
      const file = this.activeFile;
      if (!file || !file.content) return;

      const blob = new Blob([file.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName;
      a.click();
      URL.revokeObjectURL(url);

      file.isDirty = false;
      file.lastModified = new Date();
    },

    // 保存所有文件
    saveAllFiles() {
      this.files.forEach((file) => {
        if (file.content && file.isImported) {
          const blob = new Blob([file.content], { type: "text/markdown" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = file.fileName;
          a.click();
          URL.revokeObjectURL(url);
          file.isDirty = false;
          file.lastModified = new Date();
        }
      });
    },
  },

  // 使用 pinia-plugin-persistedstate 自动持久化
  persist: {
    key: "md-viewer-editor",
    storage: typeof window !== "undefined" ? localStorage : undefined,
    pick: ["files", "activeFileId"],
    // 自定义序列化，处理 Date 对象
    serializer: {
      serialize: (state) => {
        return JSON.stringify(state, (key, value) => {
          if (value instanceof Date) {
            return { __type: "Date", value: value.toISOString() };
          }
          return value;
        });
      },
      deserialize: (value) => {
        return JSON.parse(value, (key, data) => {
          if (data && data.__type === "Date") {
            return new Date(data.value);
          }
          return data;
        });
      },
    },
  },
});
