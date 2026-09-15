import "server-only";
import { spawn } from "node:child_process";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { BackupRestoreValidationError } from "../domain/backup-restore-validation.error";
import type { BackupRestoreFailureCode } from "../domain/backup-restore-validation.types";

type CommandOptions = Readonly<{
  cwd: string;
  environment?: NodeJS.ProcessEnv;
  failureCode: BackupRestoreFailureCode;
}>;

function waitForCommand(
  command: string,
  args: readonly string[],
  options: CommandOptions,
  stdio: ["ignore" | "pipe", "ignore" | "pipe", "ignore"],
) {
  const child = spawn(command, args, {
    cwd: options.cwd,
    env: options.environment ?? process.env,
    shell: false,
    stdio,
    windowsHide: true,
  });
  const completion = new Promise<void>((resolve, reject) => {
    child.once("error", () => reject(new BackupRestoreValidationError(options.failureCode)));
    child.once("close", (code) =>
      code === 0 ? resolve() : reject(new BackupRestoreValidationError(options.failureCode)),
    );
  });
  return { child, completion };
}

export async function runSanitizedCommand(
  command: string,
  args: readonly string[],
  options: CommandOptions,
): Promise<void> {
  const { completion } = waitForCommand(command, args, options, ["ignore", "ignore", "ignore"]);
  await completion;
}

export async function captureSanitizedCommand(
  command: string,
  args: readonly string[],
  options: CommandOptions,
): Promise<string> {
  const { child, completion } = waitForCommand(command, args, options, [
    "ignore",
    "pipe",
    "ignore",
  ]);
  const chunks: Buffer[] = [];
  child.stdout?.on("data", (chunk: Buffer) => chunks.push(chunk));
  await completion;
  return Buffer.concat(chunks).toString("utf8").trim();
}

export async function writeCommandOutputToFile(
  command: string,
  args: readonly string[],
  path: string,
  options: CommandOptions,
): Promise<void> {
  const { child, completion } = waitForCommand(command, args, options, [
    "ignore",
    "pipe",
    "ignore",
  ]);
  if (!child.stdout) throw new BackupRestoreValidationError(options.failureCode);
  await Promise.all([pipeline(child.stdout, createWriteStream(path)), completion]);
}

export async function pipeFileToCommand(
  path: string,
  command: string,
  args: readonly string[],
  options: CommandOptions,
): Promise<void> {
  const { child, completion } = waitForCommand(command, args, options, [
    "pipe",
    "ignore",
    "ignore",
  ]);
  if (!child.stdin) throw new BackupRestoreValidationError(options.failureCode);
  await Promise.all([pipeline(createReadStream(path), child.stdin), completion]);
}
