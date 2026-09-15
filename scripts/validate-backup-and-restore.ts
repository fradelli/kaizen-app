import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import { validateLocalBackupRestore } from "../src/features/backup-restore-validation/application/validate-local-backup-restore";
import { BackupRestoreValidationError } from "../src/features/backup-restore-validation/domain/backup-restore-validation.error";
import type { BackupRestoreFailureCode } from "../src/features/backup-restore-validation/domain/backup-restore-validation.types";
import { readBackupRestoreConfiguration } from "../src/features/backup-restore-validation/data/backup-restore-configuration.utils";
import { DockerBackupRestoreEnvironment } from "../src/features/backup-restore-validation/data/docker-backup-restore-environment";
import {
  assertCanonicalRecoveryIntegrity,
  assertRecoveryMigrationsCurrent,
  assertRecoveryTargetEmpty,
  createRecoveryCanary,
  createRecoveryPrismaClient,
  deployRecoveryMigrations,
  importCanonicalRecoverySource,
  readRecoverySnapshot,
} from "../src/features/backup-restore-validation/data/prisma-backup-restore-validation";
import type { PrismaClient } from "../src/generated/prisma/client";

if (existsSync(".env")) loadEnvFile(".env");

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
let sourceClient: PrismaClient | undefined;
let restoredClient: PrismaClient | undefined;
let temporaryDirectory: string | undefined;

function publicFailureCode(error: unknown): BackupRestoreFailureCode {
  return error instanceof BackupRestoreValidationError ? error.code : "VALIDATION_FAILED";
}

function requireClient(client: PrismaClient | undefined): PrismaClient {
  if (!client) throw new BackupRestoreValidationError("VALIDATION_FAILED");
  return client;
}

try {
  const configuration = readBackupRestoreConfiguration(process.env);
  const environment = new DockerBackupRestoreEnvironment(repositoryRoot, configuration);
  const report = await validateLocalBackupRestore({
    startEnvironment: () => environment.start(),
    prepareSource: async () => {
      try {
        await deployRecoveryMigrations(repositoryRoot, configuration.source.connectionString);
        sourceClient = createRecoveryPrismaClient(configuration.source.connectionString);
        const commit = await importCanonicalRecoverySource(sourceClient, repositoryRoot);
        const canary = await createRecoveryCanary(sourceClient);
        return { commit, canary };
      } catch (error) {
        if (error instanceof BackupRestoreValidationError) throw error;
        throw new BackupRestoreValidationError("SOURCE_PREPARATION_FAILED");
      }
    },
    assertSourceIntegrity: (commit) =>
      assertCanonicalRecoveryIntegrity(requireClient(sourceClient), repositoryRoot, commit),
    readSourceSnapshot: (canary) => readRecoverySnapshot(requireClient(sourceClient), canary),
    createBackup: async () => {
      temporaryDirectory = await mkdtemp(join(tmpdir(), "kaizen-backup-restore-"));
      return environment.createBackup(join(temporaryDirectory, "kaizen.dump"));
    },
    assertRestoreTargetEmpty: () =>
      assertRecoveryTargetEmpty(configuration.restore.connectionString),
    restoreBackup: (artifact) => environment.restoreBackup(artifact),
    assertRestoredMigrationsCurrent: () =>
      assertRecoveryMigrationsCurrent(repositoryRoot, configuration.restore.connectionString),
    readRestoredSnapshot: async (canary) => {
      restoredClient ??= createRecoveryPrismaClient(configuration.restore.connectionString);
      return readRecoverySnapshot(restoredClient, canary);
    },
    assertRestoredIntegrity: async (commit) => {
      restoredClient ??= createRecoveryPrismaClient(configuration.restore.connectionString);
      await assertCanonicalRecoveryIntegrity(restoredClient, repositoryRoot, commit);
    },
    readPostgresVersion: () => environment.readPostgresVersion(),
    cleanup: async () => {
      let cleanupFailed = false;
      for (const client of [restoredClient, sourceClient]) {
        try {
          await client?.$disconnect();
        } catch {
          cleanupFailed = true;
        }
      }
      if (temporaryDirectory)
        try {
          await rm(temporaryDirectory, { force: true, recursive: true });
        } catch {
          cleanupFailed = true;
        }
      try {
        await environment.remove("CLEANUP_FAILED");
      } catch {
        cleanupFailed = true;
      }
      if (cleanupFailed) throw new BackupRestoreValidationError("CLEANUP_FAILED");
    },
    now: Date.now,
  });
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  console.error(JSON.stringify({ result: "failed", code: publicFailureCode(error) }));
  process.exitCode = 1;
}
