import "server-only";

import { databasePoolDefaults } from "./database.constants";
import type { DatabaseConfiguration } from "./database.types";
import { isLoopbackDatabase, parseDatabaseUrl } from "./database-url.utils";

export function getDatabaseUrl(): string {
  const value = process.env.DATABASE_URL;
  const url = parseDatabaseUrl(value);
  if (!url) throw new Error("Configuração de servidor inválida: DATABASE_URL.");
  if (process.env.APP_ENV === "local") {
    const allowedDatabase =
      url.pathname === "/kaizen_local" ||
      (process.env.NODE_ENV === "test" && url.pathname === "/kaizen_test");
    if (!isLoopbackDatabase(url) || !allowedDatabase) {
      throw new Error("DATABASE_URL local deve apontar ao PostgreSQL local do Kaizen.");
    }
  }
  if (process.env.APP_ENV !== "local" && url.searchParams.get("sslmode") !== "verify-full") {
    throw new Error("DATABASE_URL exige TLS com verificação completa fora do ambiente local.");
  }
  return value!;
}

export function getDatabaseConfiguration(): DatabaseConfiguration {
  return Object.freeze({ connectionString: getDatabaseUrl(), ...databasePoolDefaults });
}
