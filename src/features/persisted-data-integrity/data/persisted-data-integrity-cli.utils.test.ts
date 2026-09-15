import { describe, expect, it } from "vitest";
import { parseIntegrityArguments } from "./persisted-data-integrity-cli.utils";
describe("argumentos da auditoria somente leitura", () => {
  it("seleciona HEAD/public por padrão e aceita commit/schema explícitos", () => {
    expect(parseIntegrityArguments([])).toEqual({ commit: "HEAD", schema: "public" });
    const schema = `kaizen_import_test_${"b".repeat(32)}`;
    expect(parseIntegrityArguments(["--schema", schema, "--commit", "a".repeat(40)])).toEqual({
      commit: "a".repeat(40),
      schema,
    });
  });
  it.each(
    [
      ["--commit"],
      ["--commit", "developer"],
      ["--commit", "HEAD", "--commit", "HEAD"],
      ["--schema", "public"],
      ["--database", "local"],
      ["--fix", "true"],
    ].map((args) => ({ args })),
  )("rejeita argumento inválido $args", ({ args }) =>
    expect(() => parseIntegrityArguments(args)).toThrow(
      expect.objectContaining({ code: "CLI_INVALID" }),
    ),
  );
});
