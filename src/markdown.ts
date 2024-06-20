import isString from 'lodash/isString';
import { remark } from 'remark';
import strip from 'strip-markdown';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';

export function stripMarkdown(s?: string): string {
  if (!s) return '';
  if (!isString(s)) return s;
  return remark().use(strip).processSync(s).toString().trim();
}

export function renderMarkdown(md : string) : string {
  const html = 
    remark()
      .use(remarkGfm)
      .use(remarkSmartypants)
      .use(remarkHtml, { sanitize: false })
      .processSync(md.trim())
      .toString();

  return html;
}