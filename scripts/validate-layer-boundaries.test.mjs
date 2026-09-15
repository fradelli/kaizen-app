import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { validateLayerBoundaries } from "./validate-layer-boundaries.mjs";

function withRepository(files, assertion) {
  const root = mkdtempSync(resolve(tmpdir(), "kaizen-layer-boundaries-"));
  try {
    for (const [path, content] of Object.entries(files)) {
      const absolute = resolve(root, path);
      mkdirSync(resolve(absolute, ".."), { recursive: true });
      writeFileSync(absolute, content);
    }
    assertion(root);
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
}

test("accepts inward dependencies", () =>
  withRepository(
    {
      "src/features/example/domain/entity.ts": "export type Entity = {};",
      "src/features/example/application/use-case.ts":
        'import type { Entity } from "../domain/entity"; export type Result = Entity;',
      "src/features/example/data/repository.ts":
        'import type { Result } from "../application/use-case"; export type Stored = Result;',
    },
    (root) => assert.deepEqual(validateLayerBoundaries({ repositoryRoot: root }), []),
  ));

test("rejects domain, application and UI dependencies on infrastructure", () =>
  withRepository(
    {
      "src/features/example/data/repository.ts": "export const repository = {};",
      "src/features/example/domain/entity.ts": 'import { repository } from "../data/repository";',
      "src/features/example/application/use-case.ts":
        'import { repository } from "../data/repository";',
      "src/features/example/components/card/card.tsx":
        'import { repository } from "../../data/repository";',
    },
    (root) => assert.equal(validateLayerBoundaries({ repositoryRoot: root }).length, 3),
  ));

test("rejects infrastructure in a client boundary", () =>
  withRepository(
    {
      "src/lib/db/client.ts": "export const database = {};",
      "src/features/example/hooks/use-example.ts":
        '"use client";\nimport { database } from "@/lib/db/client";',
    },
    (root) => assert.equal(validateLayerBoundaries({ repositoryRoot: root }).length, 1),
  ));
