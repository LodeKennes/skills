import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { assertNode24, projectRoot, runCommand } from "./lib.mjs";

async function collect(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(target)));
    else if (entry.isFile() && entry.name.endsWith(".mjs")) files.push(target);
  }
  return files;
}

async function main() {
  assertNode24();
  const files = [
    ...(await collect(resolve(projectRoot, "scripts"))),
    ...(await collect(resolve(projectRoot, "test"))),
  ].sort();
  for (const file of files) await runCommand(process.execPath, ["--check", file]);
  console.log(`Syntax checked ${files.length} JavaScript files`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
