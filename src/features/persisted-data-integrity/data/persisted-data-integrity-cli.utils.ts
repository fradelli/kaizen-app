import { assertDisposableTestSchema } from "@/lib/db/test-database-configuration.utils";

export function parseIntegrityArguments(
  args: readonly string[],
): Readonly<{ commit: string; schema: string }> {
  let commit = "HEAD";
  let schema = "public";
  const seen = new Set<string>();
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    const value = args[index + 1];
    if (!value || seen.has(flag)) throw new Error("Argumentos de integridade inválidos.");
    seen.add(flag);
    if (flag === "--commit" && /^(HEAD|[0-9a-f]{40})$/.test(value)) commit = value;
    else if (flag === "--schema") {
      assertDisposableTestSchema(value);
      schema = value;
    } else throw new Error("Argumentos de integridade inválidos.");
  }
  return { commit, schema };
}
