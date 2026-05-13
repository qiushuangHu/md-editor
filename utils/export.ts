/**
 * 动态加载 html2pdf.js（仅客户端）
 */
const getHtml2pdf = async () => {
  if (process.server) {
    throw new Error("PDF导出仅支持在浏览器环境中使用");
  }

  // 动态导入 html2pdf.js
  const html2pdfModule = await import("html2pdf.js");

  // html2pdf.js 导出的是一个函数，直接返回
  const html2pdf = html2pdfModule.default;

  console.log("[PDF导出] html2pdf 类型:", typeof html2pdf);

  return html2pdf;
};

/**
 * 将Markdown内容导出为PDF
 * @param content HTML内容（如果为空，则使用页面中的预览元素）
 * @param fileName 文件名
 * @param usePreview 是否使用页面中的预览元素（推荐）
 */
export const exportToPdf = async (
  content: string,
  fileName: string = "document.pdf",
  usePreview: boolean = true
) => {
  const totalTimeStart = performance.now();

  try {
    console.log("[PDF导出] ========== 开始导出 ==========");
    console.log("[PDF导出] 内容长度:", content.length);
    console.log("[PDF导出] 使用预览元素:", usePreview);

    let elementToExport: HTMLElement | null = null;
    let stepStart: number;

    // 步骤1：查找或创建元素
    stepStart = performance.now();

    if (usePreview) {
      // 方法1：使用页面中已渲染的预览元素（推荐）
      elementToExport = document.querySelector(".markdown-preview");

      if (!elementToExport) {
        console.warn("[PDF导出] 未找到预览元素，使用临时容器方案");
        usePreview = false;
      } else {
        const stepDuration = performance.now() - stepStart;
        console.log(
          `[PDF导出] ✓ 找到预览元素 (${stepDuration.toFixed(1)}ms):`,
          elementToExport.tagName,
          "子元素:",
          elementToExport.children.length,
          "尺寸:",
          `${elementToExport.offsetWidth}x${elementToExport.offsetHeight}`
        );
      }
    }

    if (!usePreview || !elementToExport) {
      // 方法2：创建临时容器
      stepStart = performance.now();
      const container = document.createElement("div");
      container.className = "markdown-preview";
      container.innerHTML = content;

      container.style.cssText = `
        position: absolute;
        left: -10000px;
        top: 0;
        max-width: 100%;
        padding: 20px;
      `;

      document.body.appendChild(container);
      elementToExport = container;

      const createElementDuration = performance.now() - stepStart;
      console.log(
        `[PDF导出] ✓ 创建临时容器 (${createElementDuration.toFixed(1)}ms)`
      );

      // 使用 requestAnimationFrame 等待浏览器完成重绘
      const rafStart = performance.now();
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });
      const rafDuration = performance.now() - rafStart;

      console.log(
        `[PDF导出] ✓ 等待重绘完成 (${rafDuration.toFixed(1)}ms):`,
        `尺寸: ${container.offsetWidth}x${container.offsetHeight}`
      );
    }

    if (!elementToExport) {
      throw new Error("无法找到或创建要导出的元素");
    }

    const prepareElementDuration = performance.now() - stepStart;
    console.log(
      `[PDF导出] [步骤1] 准备元素总耗时: ${prepareElementDuration.toFixed(1)}ms`
    );

    // 步骤2：加载html2pdf库
    stepStart = performance.now();
    console.log("[PDF导出] 开始加载html2pdf库...");

    const html2pdf = await getHtml2pdf();

    const loadLibraryDuration = performance.now() - stepStart;
    console.log(
      `[PDF导出] [步骤2] 加载库耗时: ${loadLibraryDuration.toFixed(1)}ms`
    );

    // 步骤3：配置和创建实例
    stepStart = performance.now();

    // 配置PDF选项（优化性能）
    const options = {
      margin: [10, 10, 10, 10],
      filename: fileName,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        letterRendering: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: elementToExport.scrollWidth,
        windowHeight: elementToExport.scrollHeight,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    const pdfInstance = html2pdf().set(options).from(elementToExport);

    const setupDuration = performance.now() - stepStart;
    console.log(
      `[PDF导出] [步骤3] 配置实例耗时: ${setupDuration.toFixed(1)}ms`
    );

    // 步骤4：生成并保存PDF
    stepStart = performance.now();
    console.log("[PDF导出] 开始渲染和生成PDF...");

    await pdfInstance.save();

    const generateDuration = performance.now() - stepStart;
    console.log(
      `[PDF导出] [步骤4] 渲染和生成耗时: ${generateDuration.toFixed(1)}ms`
    );

    // 清理临时容器
    if (
      !usePreview &&
      elementToExport &&
      document.body.contains(elementToExport)
    ) {
      document.body.removeChild(elementToExport);
      console.log("[PDF导出] ✓ 临时容器已清理");
    }

    const totalDuration = performance.now() - totalTimeStart;
    console.log("[PDF导出] ========== 导出完成 ==========");
    console.log(
      `[PDF导出] 总耗时: ${totalDuration.toFixed(1)}ms (${(
        totalDuration / 1000
      ).toFixed(2)}秒)`
    );
    console.log("[PDF导出] 耗时分布:", {
      准备元素: `${prepareElementDuration.toFixed(1)}ms`,
      加载库: `${loadLibraryDuration.toFixed(1)}ms`,
      配置实例: `${setupDuration.toFixed(1)}ms`,
      渲染生成: `${generateDuration.toFixed(1)}ms`,
      总计: `${totalDuration.toFixed(1)}ms`,
    });

    return true;
  } catch (error) {
    const totalDuration = performance.now() - totalTimeStart;
    console.error(
      `[PDF导出] ❌ 失败 (耗时: ${totalDuration.toFixed(1)}ms):`,
      error
    );
    throw error;
  }
};

/**
 * 导出为HTML文件
 */
export const exportToHtml = (
  content: string,
  fileName: string = "document.html"
) => {
  const htmlTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #fff;
    }
    
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    
    h1 { font-size: 2em; border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }
    
    p {
      margin-bottom: 16px;
    }
    
    a {
      color: #0366d6;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    code {
      padding: 0.2em 0.4em;
      margin: 0;
      font-size: 85%;
      background-color: rgba(27,31,35,0.05);
      border-radius: 3px;
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    }
    
    pre {
      padding: 16px;
      overflow: auto;
      font-size: 85%;
      line-height: 1.45;
      background-color: #f6f8fa;
      border-radius: 6px;
    }
    
    pre code {
      padding: 0;
      margin: 0;
      font-size: 100%;
      background-color: transparent;
      border: 0;
    }
    
    blockquote {
      padding: 0 1em;
      color: #6a737d;
      border-left: 0.25em solid #dfe2e5;
      margin: 0 0 16px 0;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
    }
    
    table th,
    table td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }
    
    table tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
    }
    
    table tr:nth-child(2n) {
      background-color: #f6f8fa;
    }
    
    img {
      max-width: 100%;
      box-sizing: border-box;
    }
    
    hr {
      height: 0.25em;
      padding: 0;
      margin: 24px 0;
      background-color: #e1e4e8;
      border: 0;
    }
    
    ul, ol {
      padding-left: 2em;
      margin-bottom: 16px;
    }
    
    li + li {
      margin-top: 0.25em;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;

  const blob = new Blob([htmlTemplate], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.endsWith(".html") ? fileName : `${fileName}.html`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * 复制HTML到剪贴板
 */
export const copyHtmlToClipboard = async (content: string) => {
  try {
    const blob = new Blob([content], { type: "text/html" });
    await navigator.clipboard.write([new ClipboardItem({ "text/html": blob })]);
    return true;
  } catch (error) {
    console.error("复制到剪贴板失败:", error);
    // 降级方案：复制纯文本
    try {
      const text = content.replace(/<[^>]*>/g, "");
      await navigator.clipboard.writeText(text);
      return true;
    } catch (fallbackError) {
      console.error("降级复制也失败:", fallbackError);
      return false;
    }
  }
};
