import isString from 'lodash/isString';
import { remark } from 'remark';
import strip from 'strip-markdown';

export function stripMarkdown(s : string) : string {
  if (!s) return '';
  if (!isString(s)) return s;
  return remark().use(strip).processSync(s).toString().trim();
}
