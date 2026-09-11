import "server-only";

import { z } from "zod";

const serverEnvironmentKeys = ["APP_ENV", "PERSONAL_WORKSPACE_ID"] as const;

const serverEnvironmentSchema = z.object({
  APP_ENV: z.enum(["local", "preview", "production"]),
  PERSONAL_WORKSPACE_ID: z.uuid(),
});

export type ServerEnvironment = Readonly<z.infer<typeof serverEnvironmentSchema>>;

export type ServerEnvironmentVariable = (typeof serverEnvironmentKeys)[number];

export class ServerEnvironmentConfigurationError extends Error {
  readonly code = "SERVER_ENVIRONMENT_INVALID" as const;
  readonly invalidVariables: readonly ServerEnvironmentVariable[];

  constructor(invalidVariables: readonly ServerEnvironmentVariable[]) {
    const normalizedVariables = [...new Set(invalidVariables)].sort();

    super(`Configuração de servidor inválida: ${normalizedVariables.join(", ")}.`);

    this.name = "ServerEnvironmentConfigurationError";
    this.invalidVariables = Object.freeze(normalizedVariables);
  }
}

let cachedEnvironment: ServerEnvironment | undefined;

export function getServerEnvironment(): ServerEnvironment {
  if (cachedEnvironment) {
    return cachedEnvironment;
  }

  const result = serverEnvironmentSchema.safeParse(process.env);

  if (!result.success) {
    const invalidVariables = result.error.issues.flatMap((issue) => {
      const [variable] = issue.path;

      return typeof variable === "string" &&
        serverEnvironmentKeys.includes(variable as ServerEnvironmentVariable)
        ? [variable as ServerEnvironmentVariable]
        : [];
    });

    throw new ServerEnvironmentConfigurationError(invalidVariables);
  }

  cachedEnvironment = Object.freeze(result.data);

  return cachedEnvironment;
}
