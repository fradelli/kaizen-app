export function validateDocuments(input: {
  documents: ReadonlyMap<string, unknown>;
  repositoryRoot?: string;
  availablePaths?: ReadonlySet<string>;
  stopOnSchemaError?: boolean;
}): string[];
export function validateData(input?: { repositoryRoot?: string }): string[];
