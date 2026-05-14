const RAW = import.meta.env.BASE_URL;
export const BASE = RAW.replace(/\/$/, '');

export function link(path: string): string {
  if (!path) return BASE || '/';
  if (path === '/') return BASE ? `${BASE}/` : '/';
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${clean}`;
}

export function isCurrent(currentPath: string, target: string): boolean {
  const t = link(target);
  if (target === '/' || target === '') {
    return (
      currentPath === '/' ||
      currentPath === (BASE || '/') ||
      currentPath === `${BASE}/`
    );
  }
  return currentPath === t || currentPath.startsWith(`${t}/`);
}
