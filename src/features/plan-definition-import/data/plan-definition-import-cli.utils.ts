import "server-only";
import { parseArgs } from "node:util";
import { PlanDefinitionImportError } from "../domain/plan-definition-import.error";
import type { PlanDefinitionImportEnvironment } from "../domain/plan-definition-import.types";
export function parseImportArguments(
  args: readonly string[],
  appEnvironment: string,
): { commit: string; environment: PlanDefinitionImportEnvironment; activeTrainingOnly?: true } {
  try {
    const { values } = parseArgs({
      args: [...args],
      options: {
        commit: { type: "string", default: "HEAD" },
        environment: { type: "string" },
        "active-training-only": { type: "boolean", default: false },
      },
      strict: true,
      allowPositionals: false,
    });
    const environment = values.environment;
    const permitted =
      appEnvironment === "local"
        ? ["local"]
        : appEnvironment === "preview"
          ? ["preview"]
          : appEnvironment === "production"
            ? ["staging", "production"]
            : [];
    if (
      !environment ||
      !permitted.includes(environment) ||
      !/^(HEAD|[0-9a-f]{40})$/.test(values.commit) ||
      (values["active-training-only"] && environment !== "local")
    )
      throw new Error();
    return {
      commit: values.commit,
      environment: environment as PlanDefinitionImportEnvironment,
      ...(values["active-training-only"] ? { activeTrainingOnly: true as const } : {}),
    };
  } catch {
    throw new PlanDefinitionImportError("CLI_INVALID");
  }
}
