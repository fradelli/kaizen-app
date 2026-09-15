import { describe, expect, it } from "vitest";
import { readBackupRestoreConfiguration } from "./backup-restore-configuration.utils";

describe("configuração descartável de recuperação", () => {
  it("constrói somente os dois destinos fixos e distintos", () => {
    const configuration = readBackupRestoreConfiguration({
      BACKUP_DATABASE_PASSWORD: "synthetic-only",
    });
    expect(configuration.source).toMatchObject({
      service: "database-backup-source",
      database: "kaizen_backup_source",
      port: 5434,
    });
    expect(configuration.restore).toMatchObject({
      service: "database-backup-restore",
      database: "kaizen_backup_restore",
      port: 5435,
    });
  });

  it.each([
    {},
    { BACKUP_DATABASE_PASSWORD: "short" },
    {
      BACKUP_DATABASE_PASSWORD: "synthetic-only",
      BACKUP_SOURCE_DATABASE_PORT: "5435",
      BACKUP_RESTORE_DATABASE_PORT: "5435",
    },
    {
      BACKUP_DATABASE_PASSWORD: "synthetic-only",
      BACKUP_SOURCE_DATABASE_PORT: "5432",
    },
    {
      BACKUP_DATABASE_PASSWORD: "synthetic-only",
      BACKUP_RESTORE_DATABASE_PORT: "external",
    },
  ])("rejeita configuração que pode alcançar destino não descartável", (environment) => {
    expect(() => readBackupRestoreConfiguration(environment)).toThrow(
      expect.objectContaining({ code: "CONFIGURATION_INVALID" }),
    );
  });
});
