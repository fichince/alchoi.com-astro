import isString from 'lodash/isString';
import { remark } from 'remark';
import strip from 'strip-markdown';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import remarkExcerpt from 'remark-excerpt';
import { unified } from 'unified';

export function stripMarkdown(s?: string): string {
  if (!s) return '';
  if (!isString(s)) return s;
  return remark().use(strip).processSync(s).toString().trim();
}

export function renderMarkdown(md : string) : string {
  const html =
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkSmartypants)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .processSync(md.trim())
      .toString();

  return html;
}

export function renderWithExcerpt(md : string) : { content: string, excerpt: string | null } {

  const html =
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkSmartypants)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .processSync(md.trim())
      .toString();

  const htmlExcerpted =
    unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkSmartypants)
      .use(remarkExcerpt)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .processSync(md.trim())
      .toString();

  const hasExcerpt = html.length !== htmlExcerpted.length;

  return {
    content: html,
    excerpt: hasExcerpt ? htmlExcerpted : null
  };

}
