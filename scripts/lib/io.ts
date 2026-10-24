import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
export const generatedDir = join(root, "src/data/generated");

export function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

export function writeGenerated(name: string, value: unknown): void {
  mkdirSync(generatedDir, { recursive: true });
  writeFileSync(join(generatedDir, name), `${JSON.stringify(value, null, 2)}\n`);
}
