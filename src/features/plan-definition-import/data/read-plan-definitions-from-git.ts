import "server-only";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { PlanDefinitionImportError } from "../domain/plan-definition-import.error";
import type {
  PlanDefinitionSnapshot,
  PlanDefinitionSource,
  PlanDefinitionSourceKind,
} from "../domain/plan-definition-import.types";
import {
  parseMigrationManifest,
  assertLegacySourceIsPublishable,
} from "./migration-manifest.utils";

const fixedSources: Readonly<Record<string, PlanDefinitionSourceKind>> = {
  "data/exercises.json": "exercise_library",
  "data/training-execution-metadata.json": "execution_metadata",
  "data/schedule.json": "training_schedule",
  "data/active.json": "training_pointer",
  "data/nutrition/active.json": "nutrition_pointer",
};
export function sourceKind(path: string): PlanDefinitionSourceKind | undefined {
  if (Object.hasOwn(fixedSources, path)) return fixedSources[path];
  if (/^data\/plans\/[a-z0-9-]+\.json$/.test(path)) return "training_plan";
  if (/^data\/nutrition\/plans\/[a-z0-9-]+\.json$/.test(path)) return "nutrition_plan";
  return undefined;
}

function isGitRevisionFailure(error: unknown): boolean {
  return (
    error instanceof Error &&
    "status" in error &&
    typeof error.status === "number" &&
    error.status !== 0
  );
}
export async function readPlanDefinitionsFromGit(
  repositoryRoot: string,
  revision = "HEAD",
): Promise<PlanDefinitionSnapshot> {
  try {
    if (!/^(HEAD|[0-9a-f]{40})$/.test(revision))
      throw new PlanDefinitionImportError("SOURCE_INVALID");
    const git = (args: string[]) =>
      execFileSync("git", ["-C", repositoryRoot, ...args], {
        timeout: 30_000,
        maxBuffer: 16 * 1024 * 1024,
        stdio: ["ignore", "pipe", "pipe"],
      });
    const commit = git(["rev-parse", "--verify", `${revision}^{commit}`])
      .toString()
      .trim();
    const entries = git(["ls-tree", "-r", "-z", commit])
      .toString()
      .split("\0")
      .filter(Boolean)
      .map((entry) => {
        const [metadata, path] = entry.split("\t");
        return { path, mode: metadata.split(" ")[0] };
      });
    const availablePaths = new Set(
      entries
        .filter((entry) => ["100644", "100755"].includes(entry.mode))
        .map((entry) => entry.path),
    );
    const documents = new Map<string, unknown>();
    const sources: PlanDefinitionSource[] = [];
    const manifestPath = "docs/migration/MIGRATION-MANIFEST.md";
    if (!availablePaths.has(manifestPath)) throw new PlanDefinitionImportError("SOURCE_INVALID");
    const manifestArtifacts = parseMigrationManifest(
      git(["show", `${commit}:${manifestPath}`]).toString("utf8"),
    );
    for (const { path } of entries) {
      const kind = sourceKind(path);
      if (!kind && !/^schemas\/[a-z0-9-]+\.schema\.json$/.test(path)) continue;
      if (!availablePaths.has(path)) throw new PlanDefinitionImportError("SOURCE_INVALID");
      // O manifesto governa o legado; fontes nativas seguem a allowlist canônica.
      if (kind) assertLegacySourceIsPublishable(path, manifestArtifacts);
      const bytes = git(["show", `${commit}:${path}`]);
      const document = JSON.parse(bytes.toString("utf8"));
      documents.set(path, document);
      if (kind)
        sources.push({
          path,
          kind,
          document,
          sha256: createHash("sha256").update(bytes).digest("hex"),
          schemaVersion: document.schema_version,
        });
    }
    return { commit, sources, documents, availablePaths };
  } catch (error) {
    if (error instanceof PlanDefinitionImportError) throw error;
    if (error instanceof SyntaxError || isGitRevisionFailure(error))
      throw new PlanDefinitionImportError("SOURCE_INVALID");
    throw new PlanDefinitionImportError("IMPORT_UNAVAILABLE");
  }
}
