export function parseDatabaseUrl(value: unknown): URL | undefined {
  if (typeof value !== "string" || value.length === 0) return undefined;
  try {
    const url = new URL(value);
    return ["postgres:", "postgresql:"].includes(url.protocol) &&
      url.hostname &&
      url.pathname.length > 1
      ? url
      : undefined;
  } catch {
    return undefined;
  }
}

export function isLoopbackDatabase(url: URL): boolean {
  return ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
}
