/**
 * Markdown文件类型定义
 */
export interface MdFile {
  /** 唯一标识 */
  id: string;
  /** 文件名 */
  fileName: string;
  /** Markdown内容 */
  content: string;
  /** 文件大小（字节） */
  fileSize: number;
  /** 文件最后修改时间 */
  lastModified: Date | null;
  /** 是否有未保存的更改 */
  isDirty: boolean;
  /** 是否从文件导入 */
  isImported: boolean;
  /** 撤销历史栈 */
  history: string[];
  /** 重做栈 */
  redoStack: string[];
  /** 历史记录最大数 */
  maxHistory: number;
  /** 滚动位置（可选） */
  scrollTop?: number;
  /** 光标位置（可选） */
  cursorPosition?: { start: number; end: number };
}
