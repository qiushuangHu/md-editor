import { ref } from "vue";
import zhCN from "./locales/zh-CN";
import en from "./locales/en";

export type Locale = "zh-CN" | "en";

interface Messages {
  [key: string]: string | Messages;
}

const messages: Record<Locale, Messages> = { "zh-CN": zhCN, en };

const STORAGE_KEY = "md-viewer-locale";
const DEFAULT_LOCALE: Locale = "zh-CN";

const isLocale = (value: unknown): value is Locale =>
  value === "zh-CN" || value === "en";

// 初始语言：localStorage > 浏览器语言 > 默认中文
const detectLocale = (): Locale => {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (isLocale(saved)) return saved;
  return navigator.language.toLowerCase().startsWith("zh")
    ? DEFAULT_LOCALE
    : "en";
};

// 模块级共享的响应式语言状态，t() 读取它以保持模板响应式
export const locale = ref<Locale>(DEFAULT_LOCALE);

if (typeof window !== "undefined") {
  locale.value = detectLocale();
  document.documentElement.lang = locale.value;
}

export const setLocale = (next: Locale) => {
  locale.value = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }
};

export const toggleLocale = () =>
  setLocale(locale.value === "zh-CN" ? "en" : "zh-CN");

const lookup = (dict: Messages | undefined, key: string): string | undefined =>
  key
    .split(".")
    .reduce<
      Messages | string | undefined
    >((node, part) => (node && typeof node === "object" ? node[part] : undefined), dict) as
    | string
    | undefined;

export const t = (
  key: string,
  params?: Record<string, string | number>,
): string => {
  const text = lookup(messages[locale.value], key) ?? key;
  if (!params) return text;
  return Object.entries(params).reduce(
    (acc, [name, value]) => acc.replaceAll(`{${name}}`, String(value)),
    text,
  );
};
