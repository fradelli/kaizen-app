export type MigrationManifestArtifact = Readonly<{
  sourcePath: string;
  destinationPath: string | null;
  exposure: string;
  status: string;
}>;
