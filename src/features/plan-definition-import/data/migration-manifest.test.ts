import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import {
  assertLegacySourceIsPublishable,
  parseMigrationManifest,
} from "./migration-manifest.utils";

describe("publicação de fontes do legado", () => {
  it("converte a tabela em propriedades nomeadas e ignora cabeçalhos", () => {
    const artifacts = parseMigrationManifest(
      [
        "| artifact_id | source_repository | source_commit | source_path | source_sha256 | destination_path | destination_sha256 | treatment | exposure | status | decision | verified_at |",
        "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
        "| approved | legacy | commit | data/original.json | hash | data/exercises.json | hash | COPY | PUBLIC | VERIFIED | approved | date |",
        "| private | legacy | commit | data/private.json | hash | null | null | SKIP | DO_NOT_PUBLISH | SKIPPED | private | null |",
      ].join("\n"),
    );
    expect(artifacts).toEqual([
      {
        sourcePath: "data/original.json",
        destinationPath: "data/exercises.json",
        exposure: "PUBLIC",
        status: "VERIFIED",
      },
      {
        sourcePath: "data/private.json",
        destinationPath: null,
        exposure: "DO_NOT_PUBLISH",
        status: "SKIPPED",
      },
    ]);
    expect(() => assertLegacySourceIsPublishable("data/exercises.json", artifacts)).not.toThrow();
    expect(() => assertLegacySourceIsPublishable("data/private.json", artifacts)).toThrow(
      "SOURCE_INVALID",
    );
    expect(() => assertLegacySourceIsPublishable("data/native.json", artifacts)).not.toThrow();
  });
  it("exige exposição pública e verificação de artefato migrado", () => {
    expect(() =>
      assertLegacySourceIsPublishable("data/exercises.json", [
        {
          sourcePath: "data/exercises.json",
          destinationPath: "data/exercises.json",
          exposure: "PUBLIC",
          status: "MIGRATED",
        },
      ]),
    ).toThrow("SOURCE_INVALID");
  });
});
