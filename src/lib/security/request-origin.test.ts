import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { assertSameOriginRequest, InvalidRequestOriginError } from "./request-origin";

describe("assertSameOriginRequest", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("accepts the exact request host including its port", () => {
    const headers = new Headers({ origin: "http://localhost:3000", host: "localhost:3000" });
    expect(() => assertSameOriginRequest(headers)).not.toThrow();
  });

  it("uses the forwarded host when the application is behind a proxy", () => {
    const headers = new Headers({
      origin: "https://kaizen.example.com",
      host: "internal:3000",
      "x-forwarded-host": "kaizen.example.com",
    });
    expect(() => assertSameOriginRequest(headers)).not.toThrow();
  });

  it("rejects missing, malformed and cross-origin requests", () => {
    expect(() => assertSameOriginRequest(new Headers({ host: "localhost:3000" }))).toThrow(
      InvalidRequestOriginError,
    );
    expect(() =>
      assertSameOriginRequest(new Headers({ origin: "not-a-url", host: "localhost:3000" })),
    ).toThrow(InvalidRequestOriginError);
    expect(() =>
      assertSameOriginRequest(
        new Headers({ origin: "https://attacker.example", host: "kaizen.example" }),
      ),
    ).toThrow(InvalidRequestOriginError);
  });
});
