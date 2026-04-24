// Derive the active project slug from the URL, and build per-panel data URLs.
//
// Default project (URL "/"):         slug = null, files = data/<panel>/<panel>.json
// Python-1 mockup (URL ".../python1"): slug = "python1", files = data/<panel>/python1.json

const KNOWN_SLUGS = ['python1', 'python2', 'map1'];

export function resolveProjectSlug(pathname) {
  if (!pathname) return null;
  const trimmed = pathname.replace(/\/+$/, '');
  const last = trimmed.slice(trimmed.lastIndexOf('/') + 1);
  return KNOWN_SLUGS.includes(last) ? last : null;
}

export function panelUrl(panel, slug) {
  const file = slug ? `${slug}.json` : `${panel}.json`;
  return `data/${panel}/${file}`;
}
