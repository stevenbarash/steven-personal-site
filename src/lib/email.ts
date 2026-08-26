/**
 * Converts the centrally stored display form into a working mailto link.
 * The rendered href intentionally exposes the address to browsers and crawlers.
 */
export function decodeEmailHref(obfuscated: string): string {
  const decoded = obfuscated.replace('(at)', '@').replace('(dot)', '.');
  return `mailto:${decoded}`;
}
