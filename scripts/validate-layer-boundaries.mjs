import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function collectSourceFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? collectSourceFiles(path) : [path];
  });
}

function repositoryPath(repositoryRoot, path) {
  return relative(repositoryRoot, path).replaceAll("\\", "/");
}

function resolveImport(repositoryRoot, importer, specifier) {
  if (specifier.startsWith("@/")) return `src/${specifier.slice(2)}`;
  if (specifier.startsWith("."))
    return repositoryPath(repositoryRoot, resolve(dirname(importer), specifier));
  return undefined;
}

function importedPaths(repositoryRoot, file, source) {
  const paths = [];
  const pattern = /(?:import|export)\s+(?:type\s+)?(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;
  for (const match of source.matchAll(pattern)) {
    const path = resolveImport(repositoryRoot, file, match[1]);
    if (path) paths.push(path);
  }
  return paths;
}

function layer(path) {
  if (path.includes("/domain/")) return "domain";
  if (path.includes("/application/")) return "application";
  if (path.includes("/data/")) return "data";
  if (path.includes("/components/") || path.startsWith("src/components/")) return "ui";
  return "other";
}

function incompatibleBoundary(sourceLayer, target) {
  if (sourceLayer === "domain") return !target.includes("/domain/");
  if (sourceLayer === "application")
    return (
      target.includes("/data/") || target.startsWith("src/generated/") || target.includes("/db/")
    );
  if (sourceLayer === "ui")
    return (
      target.includes("/data/") || target.startsWith("src/generated/") || target.includes("/db/")
    );
  return false;
}

export function validateLayerBoundaries({ repositoryRoot = process.cwd() } = {}) {
  const files = collectSourceFiles(resolve(repositoryRoot, "src")).filter(
    (path) => /\.(?:ts|tsx)$/.test(path) && !/\.test\.(?:ts|tsx)$/.test(path),
  );
  const errors = [];
  for (const file of files) {
    const sourcePath = repositoryPath(repositoryRoot, file);
    const source = readFileSync(file, "utf8");
    const sourceLayer = layer(sourcePath);
    for (const target of importedPaths(repositoryRoot, file, source)) {
      if (incompatibleBoundary(sourceLayer, target))
        errors.push(`${sourcePath}: a camada ${sourceLayer} não pode importar ${target}.`);
      if (
        /^\s*["']use client["'];/m.test(source) &&
        (target.includes("/data/") ||
          target.startsWith("src/generated/") ||
          target.includes("/db/") ||
          target.startsWith("scripts/"))
      )
        errors.push(`${sourcePath}: código client não pode importar ${target}.`);
    }
  }
  return [...new Set(errors)].sort();
}

const currentFile = fileURLToPath(import.meta.url);
if (resolve(process.argv[1] ?? "") === currentFile) {
  const errors = validateLayerBoundaries();
  if (errors.length) {
    console.error("Layer boundary validation failed:\n");
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else console.log("Layer boundary validation passed.");
}
