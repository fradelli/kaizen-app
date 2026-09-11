import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";

import { validateComponentStructure } from "./validate-component-structure.mjs";

function createRepository(files) {
  const repositoryRoot = mkdtempSync(resolve(tmpdir(), "kaizen-component-structure-"));

  for (const [path, content = ""] of Object.entries(files)) {
    const absolutePath = resolve(repositoryRoot, path);
    mkdirSync(resolve(absolutePath, ".."), { recursive: true });
    writeFileSync(absolutePath, content);
  }

  return repositoryRoot;
}

function removeRepository(repositoryRoot) {
  rmSync(repositoryRoot, { force: true, recursive: true });
}

test("accepts components with isolated folders and colocated responsibilities", () => {
  const repositoryRoot = createRepository({
    "src/components/shared/card/card.tsx": "export function Card() {}",
    "src/components/shared/card/card.styles.ts": "export const styles = {};",
    "src/components/shared/card/card.types.ts": "export type CardProps = {};",
    "src/components/shared/card/components/card-action/card-action.tsx":
      "export function CardAction() {}",
    "src/components/shared/card/components/card-action/card-action.styles.ts":
      "export const styles = {};",
  });

  try {
    assert.deepEqual(validateComponentStructure({ repositoryRoot }), []);
  } finally {
    removeRepository(repositoryRoot);
  }
});

test("rejects a loose component inside a shared components directory", () => {
  const repositoryRoot = createRepository({
    "src/components/shared/components/card-action.tsx": "export function CardAction() {}",
  });

  try {
    assert.deepEqual(validateComponentStructure({ repositoryRoot }), [
      'src/components/shared/components/card-action.tsx: o componente deve estar em uma pasta própria chamada "card-action".',
    ]);
  } finally {
    removeRepository(repositoryRoot);
  }
});

test("rejects auxiliary files owned by another component", () => {
  const repositoryRoot = createRepository({
    "src/features/example/components/card/card.tsx": "export function Card() {}",
    "src/features/example/components/card/other.styles.ts": "export const styles = {};",
  });

  try {
    assert.deepEqual(validateComponentStructure({ repositoryRoot }), [
      'src/features/example/components/card/other.styles.ts: arquivo misturado na pasta do componente "card"; mova-o para o componente responsável.',
    ]);
  } finally {
    removeRepository(repositoryRoot);
  }
});

test("does not apply the component convention to Next.js App Router entries", () => {
  const repositoryRoot = createRepository({
    "src/app/page.tsx": "export default function Page() {}",
  });

  try {
    assert.deepEqual(validateComponentStructure({ repositoryRoot }), []);
  } finally {
    removeRepository(repositoryRoot);
  }
});
