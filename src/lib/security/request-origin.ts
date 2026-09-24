import "server-only";

export class InvalidRequestOriginError extends Error {
  readonly code = "INVALID_REQUEST_ORIGIN" as const;
}

export function assertSameOriginRequest(headers: Headers): void {
  const origin = headers.get("origin");
  const host = headers.get("x-forwarded-host") ?? headers.get("host");

  if (!origin || !host) {
    throw new InvalidRequestOriginError("A origem da solicitação não pôde ser validada.");
  }

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new InvalidRequestOriginError("A origem da solicitação é inválida.");
  }

  if (originHost.toLowerCase() !== host.split(",")[0]!.trim().toLowerCase()) {
    throw new InvalidRequestOriginError("A origem da solicitação não é permitida.");
  }
}
