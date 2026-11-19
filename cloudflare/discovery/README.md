# Homepage discovery

The Worker serves the API catalog and linked descriptions; the origin remains unchanged. Deploy `wrangler.jsonc` to the `barash.me` zone. Configure the homepage separately under **Rules → Transform Rules → Modify Response Header**:

- Name: `Homepage discovery links`
- Expression: `(http.host eq "barash.me" and http.request.uri.path eq "/" and http.request.method in {"GET" "HEAD"})`
- Operation: **Add static** (not Set), header `Link`
- Value: `</.well-known/api-catalog>; rel="api-catalog", </discovery/openapi.json>; rel="service-desc", </discovery/sitemap.md>; rel="service-doc", </discovery/site.jsonld>; rel="describedby"`

Matching the path rather than an exact Worker route includes homepage requests with query strings without routing unrelated requests through the Worker.

Validate after changing either half:

```sh
curl -sSI 'https://barash.me/?utm_source=discovery-test'
curl -sS -H 'Content-Type: application/json' -d '{"url":"https://barash.me"}' https://isitagentready.com/api/scan | jq -e '.checks.discoverability.linkHeaders.status == "pass"'
```
