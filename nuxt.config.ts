export default defineNuxtConfig({
  devtools: { enabled: false },

  ssr: false,

  // 使用 tailwindcss、pinia 和持久化模块
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
  ],

  app: {
    head: {
      title: "MD Viewer - Markdown阅读器",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "轻量级、高性能的在线Markdown阅读器，支持实时预览、代码高亮、主题切换等功能",
        },
        { name: "keywords", content: "markdown,阅读器,预览,编辑器,在线工具" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  css: [
    "@/assets/css/main.css",
    "katex/dist/katex.min.css",
    "highlight.js/styles/github.css",
  ],

  compatibilityDate: "2024-11-01",

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  nitro: {
    compressPublicAssets: true,
  },
  experimental: {
    // Workaround for Nuxt 4.4.4 SPA dev server bug (nuxt/nuxt#34957).
    // Why: with ssr:false the SSR Vite server is never created, so the
    // vite-node IPC socketPath env var is never set, breaking client-manifest
    // fetches in dev. Maintainer-recommended workaround until the fix in
    // nuxt/nuxt#34959 ships in a patched release.
    viteEnvironmentApi: true,
  },
  vite: {
    optimizeDeps: {
      include: ["markdown-it", "highlight.js", "katex"],
    },
    server: {
      fs: {
        strict: false,
      },
    },
  },

  build: {
    transpile: [],
  },

  runtimeConfig: {
    public: {
      // 标记SSR环境
      ssrEnabled: false,
    },
  },
});
