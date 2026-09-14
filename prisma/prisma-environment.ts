import { isLoopbackDatabase, parseDatabaseUrl } from "../src/lib/db/database-url.utils";

export function getPrismaDatasourceUrl(
  environment: Readonly<Record<string, string | undefined>>,
  args: readonly string[],
): string | undefined {
  if (args.includes("reset") || args.includes("push")) {
    throw new Error("Reset e db push não fazem parte do fluxo versionado do Kaizen.");
  }
  const directUrl = environment.DIRECT_URL;
  if (directUrl === undefined || directUrl === "") return undefined;
  const url = parseDatabaseUrl(directUrl);
  if (
    !url ||
    (args.includes("dev") &&
      (environment.APP_ENV !== "local" ||
        !isLoopbackDatabase(url) ||
        url.pathname !== "/kaizen_local"))
  ) {
    throw new Error("Configuração DIRECT_URL inválida ou destino não permitido para migrate dev.");
  }
  return directUrl;
}
