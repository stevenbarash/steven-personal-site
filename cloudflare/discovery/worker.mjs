const base = 'https://barash.me';
const service = `${base}/sitemap.xml`;
const targets = {
  'api-catalog': '/.well-known/api-catalog',
  'service-desc': '/discovery/openapi.json',
  'service-doc': '/discovery/sitemap.md',
  describedby: '/discovery/site.jsonld',
};
const links = Object.entries(targets).map(([rel, path]) => `<${path}>; rel="${rel}"`).join(', ');
const resources = new Map([
  [targets['api-catalog'], ['application/linkset+json', JSON.stringify({ linkset: [
    { anchor: base + targets['api-catalog'], item: [{ href: service }] },
    { anchor: service, 'service-desc': [{ href: base + targets['service-desc'], type: 'application/vnd.oai.openapi+json' }], 'service-doc': [{ href: base + targets['service-doc'], type: 'text/markdown' }] },
  ] })]],
  [targets['service-desc'], ['application/vnd.oai.openapi+json', JSON.stringify({ openapi: '3.1.0', info: { title: 'Portfolio sitemap', version: '1' }, servers: [{ url: base }], paths: { '/sitemap.xml': { get: { summary: 'List public portfolio pages', responses: { '200': { description: 'Sitemaps XML urlset', content: { 'application/xml': { schema: { type: 'string' } } } } } } } } })]],
  [targets['service-doc'], ['text/markdown; charset=utf-8', `# Portfolio sitemap\n\nGET ${service} without authentication. Read each url/loc element in the http://www.sitemaps.org/schemas/sitemap/0.9 namespace to discover a public page.\n`]],
  [targets.describedby, ['application/ld+json', JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', url: `${base}/`, name: 'Steven Barash' })]],
]);

export default {
  async fetch(request) {
    const path = new URL(request.url).pathname;
    const resource = resources.get(path);
    const readable = request.method === 'GET' || request.method === 'HEAD';
    if (resource) {
      if (!readable) return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
      const headers = { 'Content-Type': resource[0] };
      if (path === targets['api-catalog']) headers.Link = `<${path}>; rel="api-catalog"`;
      return new Response(request.method === 'HEAD' ? null : resource[1], { headers });
    }
    const origin = await fetch(request);
    if (path !== '/' || !readable || !origin.ok) return origin;
    const response = new Response(origin.body, origin);
    response.headers.append('Link', links);
    return response;
  },
};
