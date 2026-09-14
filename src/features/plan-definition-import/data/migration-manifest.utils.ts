import "server-only";
import { PlanDefinitionImportError } from "../domain/plan-definition-import.error";
import type { MigrationManifestArtifact } from "./migration-manifest.types";

export function parseMigrationManifest(markdown: string): MigrationManifestArtifact[] {
  return markdown
    .split(/\r?\n/)
    .filter((line) => line.startsWith("| "))
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    )
    .filter(
      (cells) => cells.length === 12 && cells[0] !== "artifact_id" && !cells[0].startsWith("---"),
    )
    .map(([, , , sourcePath, , destinationPath, , , exposure, status]) => ({
      sourcePath,
      destinationPath: destinationPath === "null" ? null : destinationPath,
      exposure,
      status,
    }));
}

export function assertLegacySourceIsPublishable(
  path: string,
  artifacts: readonly MigrationManifestArtifact[],
): void {
  const matchingArtifacts = artifacts.filter(
    (artifact) =>
      artifact.destinationPath === path ||
      (artifact.destinationPath === null && artifact.sourcePath === path),
  );
  if (
    matchingArtifacts.some(
      (artifact) => artifact.exposure !== "PUBLIC" || artifact.status !== "VERIFIED",
    )
  ) {
    throw new PlanDefinitionImportError("SOURCE_INVALID");
  }
}
