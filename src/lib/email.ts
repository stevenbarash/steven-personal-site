/**
 * Converts obfuscated display email to a mailto: href at runtime.
 * Keeps the real address out of the source so crawlers only see the obfuscated form.
 */
export function decodeEmailHref(obfuscated: string): string {
  const decoded = obfuscated.replace('(at)', '@').replace('(dot)', '.');
  return `mailto:${decoded}`;
}
