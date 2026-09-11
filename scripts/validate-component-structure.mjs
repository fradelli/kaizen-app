import { existsSync, readdirSync } from "node:fs";
import { basename, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const COMPONENT_SOURCE_ROOTS = ["src/components", "src/features"];

function toRepositoryPath(repositoryRoot, path) {
  return relative(repositoryRoot, path).replaceAll("\\", "/");
}

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = resolve(directory, entry.name);

    return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
  });
}

function isComponentFile(path) {
  return path.endsWith(".tsx") && !path.endsWith(".test.tsx");
}

function getComponentName(path) {
  return basename(path, ".tsx");
}

export function validateComponentStructure({ repositoryRoot = process.cwd() } = {}) {
  const errors = [];
  const files = COMPONENT_SOURCE_ROOTS.flatMap((sourceRoot) => {
    const absoluteRoot = resolve(repositoryRoot, sourceRoot);

    return existsSync(absoluteRoot) ? collectFiles(absoluteRoot) : [];
  });

  for (const componentFile of files.filter(isComponentFile)) {
    const componentName = getComponentName(componentFile);
    const componentDirectory = dirname(componentFile);
    const directoryName = basename(componentDirectory);

    if (directoryName !== componentName) {
      errors.push(
        `${toRepositoryPath(repositoryRoot, componentFile)}: o componente deve estar em uma pasta própria chamada "${componentName}".`,
      );
      continue;
    }

    for (const sibling of readdirSync(componentDirectory, { withFileTypes: true })) {
      if (!sibling.isFile() || sibling.name.startsWith(`${componentName}.`)) {
        continue;
      }

      errors.push(
        `${toRepositoryPath(repositoryRoot, resolve(componentDirectory, sibling.name))}: arquivo misturado na pasta do componente "${componentName}"; mova-o para o componente responsável.`,
      );
    }
  }

  return errors.sort();
}

const currentFile = fileURLToPath(import.meta.url);

if (resolve(process.argv[1] ?? "") === currentFile) {
  const errors = validateComponentStructure();

  if (errors.length > 0) {
    console.error("Component structure validation failed:\n");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
  } else {
    console.log("Component structure validation passed.");
  }
}
