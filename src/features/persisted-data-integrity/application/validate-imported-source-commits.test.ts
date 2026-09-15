import { describe, expect, it, vi } from "vitest";
import { validateImportedSourceCommits } from "./validate-imported-source-commits";
import { createIntegrityFixture } from "./validate-persisted-data.fixture";
import type { IntegrityIssue } from "../domain/persisted-data-integrity.types";

describe("proveniência dos bytes no commit de primeira importação", () => {
  it("reutiliza lote de commit anterior e lê cada commit uma única vez", async () => {
    const { canonical, persisted } = createIntegrityFixture();
    const current = { ...canonical, commit: "b".repeat(40) };
    const read = vi.fn(async () => canonical);
    const issues: IntegrityIssue[] = [];
    await validateImportedSourceCommits(current, persisted, read, issues);
    expect(issues).toEqual([]);
    expect(read).toHaveBeenCalledExactlyOnceWith(canonical.commit);
  });
  it.each(["missing", "unavailable", "wrong-hash", "wrong-commit"])(
    "falha com origem %s sem expor erro de infraestrutura",
    async (failure) => {
      const { canonical, persisted } = createIntegrityFixture();
      const current = { ...canonical, commit: "b".repeat(40) };
      const read = vi.fn(async () => {
        if (failure === "unavailable") throw new Error("Detalhe privado");
        if (failure === "wrong-commit") return current;
        return {
          ...canonical,
          sources:
            failure === "missing"
              ? []
              : canonical.sources.map((source) => ({ ...source, sha256: "f".repeat(64) })),
        };
      });
      const issues: IntegrityIssue[] = [];
      await validateImportedSourceCommits(current, persisted, read, issues);
      expect(issues).toHaveLength(canonical.sources.length);
      expect(issues.every((issue) => issue.field === "sourceCommit")).toBe(true);
      expect(read).toHaveBeenCalledTimes(1);
      expect(JSON.stringify(issues)).not.toContain("Detalhe privado");
    },
  );
});
