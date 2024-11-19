import isString from 'lodash/isString';
import { remark } from 'remark';
import strip from 'strip-markdown';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';
import remarkExcerpt from 'remark-excerpt';

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

export function renderWithExcerpt(md : string) : { html: string, htmlExcerpted: string } {

  const mdExcerpted = remark().use(remarkExcerpt).processSync(md.trim()).toString();
  console.log('mdExcerpted', mdExcerpted);

  const html =
    remark()
      .use(remarkGfm)
      .use(remarkSmartypants)
      .use(remarkHtml, { sanitize: false })
      .processSync(md.trim())
      .toString();

  const htmlExcerpted =
    remark()
      .use(remarkGfm)
      .use(remarkSmartypants)
      .use(remarkHtml, { sanitize: false })
      .processSync(mdExcerpted.trim())
      .toString();

  return { html, htmlExcerpted };

}
