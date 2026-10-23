/**
 * Resolves static asset paths taking into account Vite's base path (e.g. for GitHub Pages).
 * Ensures assets load whether deployed at root '/' or repository subpath '/Deep-Fake-Detection/'.
 */
export function getAssetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
}
