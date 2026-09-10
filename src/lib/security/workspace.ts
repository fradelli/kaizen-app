import "server-only";

import { getServerEnvironment } from "@/lib/env/server";

export type WorkspaceContext = Readonly<{
  workspaceId: string;
  mode: "fixed-owner";
}>;

export function resolveFixedWorkspace(): WorkspaceContext {
  return Object.freeze({
    workspaceId: getServerEnvironment().PERSONAL_WORKSPACE_ID,
    mode: "fixed-owner",
  });
}
