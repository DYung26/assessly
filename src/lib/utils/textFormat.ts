import MarkdownIt from 'markdown-it';
import markdownItTaskLists from 'markdown-it-task-lists';
import markdownItTable from 'markdown-it-multimd-table';
import hljs from "highlight.js";
import 'highlight.js/styles/github-dark.css';
// import markdownItKatex from 'markdown-it-katex';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str: string, lang: string): string {
    let languageLabel = "";
    if (lang && hljs.getLanguage(lang)) {
      languageLabel = `<div class="bg-[#0d1117] text-white px-2 py-1 rounded-t-lg text-xs font-mono">${lang}</div>`;
      try {
        const highlighted = hljs.highlight(str, { language: lang, ignoreIllegals: true }).value;
        return `${languageLabel}<pre class="text-xs rounded-b-lg bg-gray-500 overflow-x-auto leading-normal"><code class="hljs language-${lang}">${highlighted}</code></pre>`;
      } catch {}
    }
    return `<pre class="rounded-lg bg-gray-500 overflow-x-auto text-xs"><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`;
  },
})
  .use(markdownItTaskLists)
  .use(markdownItTable, {
    multiline: true,
    rowspan: true,
    headerless: true,
  });

export function formatStreamingContent(
    raw: string
): { html: string, converted: string } {
  if (!raw) return { html: "", converted: "" };

  const converted = convertBracketsToDollars(raw);

  const htmlFromMd = md.render(converted);

  const html = renderKatexInHtml(htmlFromMd);

  return { html, converted };
}

function convertBracketsToDollars(text: string) {
  return text
    .replace(/\\\(\s*(.+?)\s*\\\)/gs, (_, inner) => `$${inner}$`)
    .replace(/\\\[\s*(.+?)\s*\\\]/gs, (_, inner) => `$$${inner}$$`);
}

function renderKatexInHtml(html: string): string {
  const containerStart = `<div class="math-container">`;
  const containerEnd = `</div>`;

  html = html.replace(/\$\$(.+?)\$\$/gs, (_, math) => {
    try {
      return katex.renderToString(
        math.trim(), { displayMode: false, throwOnError: false, strict: false }
      );
    } catch {
      return _;
    }
  });

  // Render inline math $...$ (use displayMode: false)
  html = html.replace(/\$(.+?)\$/gs, (_, math) => {
    if (math.trim() === '') return _;
    try {
      return katex.renderToString(
        math.trim(), { displayMode: false, throwOnError: false, strict: false }
      );
    } catch {
      return _;
    }
  });

  return containerStart + html + containerEnd;
}

/*
export function formatStreamingContent(raw: string): string {
  return raw;
}
*/
