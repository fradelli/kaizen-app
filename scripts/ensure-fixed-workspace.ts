import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import type { PrismaClient } from "../src/generated/prisma/client";

let client: PrismaClient | undefined;

try {
  if (existsSync(".env")) loadEnvFile(".env");
  const { resolveFixedWorkspace } = await import("../src/lib/security/workspace");
  const { getDatabaseClient } = await import("../src/lib/db/client");
  const { workspaceId } = resolveFixedWorkspace();
  client = getDatabaseClient();
  await client.workspace.upsert({
    where: { id: workspaceId },
    create: { id: workspaceId },
    update: {},
  });
  console.log(JSON.stringify({ result: "ensured" }));
} catch {
  console.error(JSON.stringify({ result: "failed", code: "WORKSPACE_BOOTSTRAP_UNAVAILABLE" }));
  process.exitCode = 1;
} finally {
  if (client) {
    try {
      await client.$disconnect();
    } catch {
      console.error(JSON.stringify({ result: "failed", code: "WORKSPACE_BOOTSTRAP_UNAVAILABLE" }));
      process.exitCode = 1;
    }
  }
}
