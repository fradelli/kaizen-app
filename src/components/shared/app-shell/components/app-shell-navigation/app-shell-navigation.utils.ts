export function isAppShellNavigationItemActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function buildAppShellNavigationHref(href: string, date: string | null): string {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return href;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return href;
  return `${href}?date=${date}`;
}
