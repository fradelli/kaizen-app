import "server-only";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import type {
  BackupArtifact,
  BackupRestoreConfiguration,
  BackupRestoreDatabaseTarget,
} from "../domain/backup-restore-validation.types";
import {
  captureSanitizedCommand,
  pipeFileToCommand,
  runSanitizedCommand,
  writeCommandOutputToFile,
} from "./backup-restore-process.utils";

const services = ["database-backup-source", "database-backup-restore"] as const;

function composeArgs(...args: string[]) {
  return ["compose", "--profile", "backup-test", ...args];
}

function postgresArgs(
  target: BackupRestoreDatabaseTarget,
  executable: "pg_dump" | "pg_restore" | "postgres",
  ...args: string[]
) {
  return composeArgs("exec", "-T", target.service, executable, ...args);
}

export class DockerBackupRestoreEnvironment {
  private readonly commandEnvironment: NodeJS.ProcessEnv = {
    ...process.env,
    LOCAL_DATABASE_PASSWORD:
      process.env.LOCAL_DATABASE_PASSWORD ?? "unused-by-backup-restore-validation",
    TEST_DATABASE_PASSWORD:
      process.env.TEST_DATABASE_PASSWORD ?? "unused-by-backup-restore-validation",
  };

  constructor(
    private readonly repositoryRoot: string,
    private readonly configuration: BackupRestoreConfiguration,
  ) {}

  async start(): Promise<void> {
    await this.remove("DOCKER_UNAVAILABLE");
    await runSanitizedCommand("docker", composeArgs("up", "-d", "--wait", ...services), {
      cwd: this.repositoryRoot,
      environment: this.commandEnvironment,
      failureCode: "DOCKER_UNAVAILABLE",
    });
  }

  async remove(failureCode: "DOCKER_UNAVAILABLE" | "CLEANUP_FAILED"): Promise<void> {
    await runSanitizedCommand("docker", composeArgs("rm", "--stop", "--force", ...services), {
      cwd: this.repositoryRoot,
      environment: this.commandEnvironment,
      failureCode,
    });
  }

  async createBackup(path: string): Promise<BackupArtifact> {
    const target = this.configuration.source;
    await writeCommandOutputToFile(
      "docker",
      postgresArgs(
        target,
        "pg_dump",
        "--username",
        target.user,
        "--dbname",
        target.database,
        "--format=custom",
        "--no-owner",
        "--no-privileges",
      ),
      path,
      {
        cwd: this.repositoryRoot,
        environment: this.commandEnvironment,
        failureCode: "BACKUP_FAILED",
      },
    );
    const [bytes, metadata] = await Promise.all([readFile(path), stat(path)]);
    return {
      path,
      sizeBytes: metadata.size,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    };
  }

  async restoreBackup(artifact: BackupArtifact): Promise<void> {
    const target = this.configuration.restore;
    await pipeFileToCommand(
      artifact.path,
      "docker",
      postgresArgs(
        target,
        "pg_restore",
        "--username",
        target.user,
        "--dbname",
        target.database,
        "--exit-on-error",
        "--single-transaction",
        "--no-owner",
        "--no-privileges",
      ),
      {
        cwd: this.repositoryRoot,
        environment: this.commandEnvironment,
        failureCode: "RESTORE_FAILED",
      },
    );
  }

  readPostgresVersion(): Promise<string> {
    return captureSanitizedCommand(
      "docker",
      postgresArgs(this.configuration.source, "postgres", "--version"),
      {
        cwd: this.repositoryRoot,
        environment: this.commandEnvironment,
        failureCode: "DOCKER_UNAVAILABLE",
      },
    );
  }
}
