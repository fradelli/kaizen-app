import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

import { defineConfig } from "prisma/config";

import { getPrismaDatasourceUrl } from "./prisma/prisma-environment";

if (existsSync(".env")) loadEnvFile(".env");

export default defineConfig({
  schema: "prisma/",
  migrations: { path: "prisma/migrations" },
  datasource: { url: getPrismaDatasourceUrl(process.env, process.argv) },
});
