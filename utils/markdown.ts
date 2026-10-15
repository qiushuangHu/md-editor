import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import katex from "katex";

// 生成标题ID的统一函数（支持处理重复标题）
export const generateHeadingId = (text: string, index: number = 0): string => {
  const baseId = text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-|-$/g, "");
  return index > 0 ? `${baseId}-${index}` : baseId;
};

// 将高亮后的 HTML 按行包裹为 .code-line，配合 CSS 计数器显示行号；
// 跨行 token（如块注释）在行尾补闭合标签、下一行开头重开，保持标签配平
export const wrapCodeLines = (html: string): string => {
  // fence 内容末尾总带一个换行，去掉避免多出一个空行号
  const lines = html.replace(/\n$/, "").split("\n");
  const openSpans: string[] = [];

  return lines
    .map((line) => {
      const prefix = openSpans.join("");
      const tagPattern = /<span[^>]*>|<\/span>/g;
      let match: RegExpExecArray | null;
      while ((match = tagPattern.exec(line)) !== null) {
        if (match[0] === "</span>") openSpans.pop();
        else openSpans.push(match[0]);
      }
      return `<span class="code-line">${prefix}${line}${"</span>".repeat(openSpans.length)}</span>`;
    })
    .join("");
};

// 创建markdown-it实例
export const createMarkdown = () => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            '<pre class="hljs"><code>' +
            wrapCodeLines(
              hljs.highlight(str, { language: lang, ignoreIllegals: true })
                .value,
            ) +
            "</code></pre>"
          );
        } catch (__) {}
      }

      return (
        '<pre class="hljs"><code>' +
        wrapCodeLines(md.utils.escapeHtml(str)) +
        "</code></pre>"
      );
    },
  });

  // 渲染数学公式
  md.inline.ruler.before("escape", "katex_inline", function (state, silent) {
    const start = state.pos;
    const end = state.pos;

    if (state.src.charAt(start) !== "$") return false;

    let pos = start + 1;
    while (pos < state.src.length && state.src.charAt(pos) !== "$") {
      if (state.src.charAt(pos) === "\\") pos++;
      pos++;
    }

    if (pos >= state.src.length) return false;

    const content = state.src.substring(start + 1, pos);

    if (!silent) {
      try {
        const rendered = katex.renderToString(content, { throwOnError: false });
        state.push("katex_inline", "", 0);
        state.tokens[state.tokens.length - 1].content = rendered;
      } catch (e) {
        state.push("katex_inline", "", 0);
        state.tokens[state.tokens.length - 1].content = state.src.substring(
          start,
          pos + 1,
        );
      }
    }

    state.pos = pos + 1;
    return true;
  });

  // 渲染块级数学公式
  md.block.ruler.before(
    "code",
    "katex_block",
    function (state, startLine, endLine, silent) {
      const pos = state.bMarks[startLine] + state.tShift[startLine];

      if (state.src.substr(pos, 2) !== "$$") return false;

      let line = startLine;
      let content = "";
      let found = false;

      for (; line < endLine; line++) {
        const contentStart = state.bMarks[line] + state.tShift[line];
        const contentEnd = state.eMarks[line];
        const lineContent = state.src.substr(
          contentStart,
          contentEnd - contentStart,
        );

        if (line === startLine) {
          content = lineContent.substr(2);
          if (content.endsWith("$$")) {
            content = content.slice(0, -2);
            found = true;
            line++;
            break;
          }
          content += "\n";
        } else if (lineContent.trim() === "$$") {
          found = true;
          line++;
          break;
        } else {
          content += lineContent + "\n";
        }
      }

      if (!found) return false;

      if (!silent) {
        try {
          const rendered = katex.renderToString(content.trim(), {
            throwOnError: false,
            displayMode: true,
          });
          state.push("katex_block", "", 0);
          state.tokens[state.tokens.length - 1].content = rendered;
          state.tokens[state.tokens.length - 1].map = [startLine, line];
        } catch (e) {
          state.push("katex_block", "", 0);
          state.tokens[state.tokens.length - 1].content = content;
        }
      }

      state.line = line;
      return true;
    },
  );

  // mermaid 代码块输出为占位容器，由客户端异步渲染为 SVG
  const defaultFence = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (token.info.trim() === "mermaid") {
      const source = md.utils.escapeHtml(token.content);
      return `<div class="mermaid-block" data-source="${source}"><pre class="mermaid">${source}</pre></div>`;
    }
    return defaultFence!(tokens, idx, options, env, self);
  };

  // 为标题添加id（处理重复标题）
  const headingCounter: Record<string, number> = {};
  md.renderer.rules.heading_open = (tokens, idx) => {
    const token = tokens[idx];
    const nextToken = tokens[idx + 1];
    if (nextToken && nextToken.type === "inline") {
      const text = nextToken.content;
      const baseId = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
        .replace(/^-|-$/g, "");

      // 处理重复标题
      if (!headingCounter[baseId]) {
        headingCounter[baseId] = 0;
      }
      const id =
        headingCounter[baseId] > 0
          ? `${baseId}-${headingCounter[baseId]}`
          : baseId;
      headingCounter[baseId]++;

      token.attrSet("id", id);
    }
    return md.renderer.renderToken(tokens, idx, {});
  };

  return md;
};

// 渲染Markdown为HTML
export const renderMarkdown = (content: string) => {
  const md = createMarkdown();
  const html = md.render(content);
  return html;
};

// 提取目录
export const extractToc = (content: string) => {
  const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
  const headingCounter: Record<string, number> = {};

  return headings.map((heading) => {
    const level = heading.match(/^#+/)?.[0].length || 1;
    const text = heading.replace(/^#+\s+/, "");
    const baseId = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
      .replace(/^-|-$/g, "");

    // 处理重复标题
    if (!headingCounter[baseId]) {
      headingCounter[baseId] = 0;
    }
    const id =
      headingCounter[baseId] > 0
        ? `${baseId}-${headingCounter[baseId]}`
        : baseId;
    headingCounter[baseId]++;

    return { level, text, id };
  });
};
