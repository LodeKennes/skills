import { mkdtemp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { assertNode24, projectRoot, runCommand } from "./lib.mjs";

const agentArguments = [
  "codex",
  "claude-code",
  "cursor",
  "gemini-cli",
  "github-copilot",
  "opencode",
];
const agentDisplayNames = [
  "Codex",
  "Claude Code",
  "Cursor",
  "Gemini CLI",
  "GitHub Copilot",
  "OpenCode",
];

function argumentValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function npmCommand() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function skillsArguments(...args) {
  return ["exec", "--yes", "--package=skills@latest", "--", "skills", ...args];
}

function parseList(stdout) {
  const start = stdout.indexOf("[");
  const end = stdout.lastIndexOf("]");
  if (start < 0 || end < start) throw new Error(`skills list did not return JSON:\n${stdout}`);
  return JSON.parse(stdout.slice(start, end + 1));
}

function canonicalPath(target) {
  try {
    return realpathSync(target);
  } catch {
    return target;
  }
}

export async function catalogSkillNames(root = projectRoot) {
  const entries = await readdir(resolve(root, "skills"), { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

export function verifyListing(list, expectedNames, scope, installOutput = "", installationRoot) {
  const names = list.map((entry) => entry.name).sort();
  if (expectedNames && JSON.stringify(names) !== JSON.stringify(expectedNames)) {
    throw new Error(`${scope}: installed skills ${names.join(", ")} do not match ${expectedNames.join(", ")}`);
  }
  for (const entry of list) {
    if (!entry.agents.includes("Claude Code")) {
      throw new Error(`${scope}/${entry.name}: Claude Code is not linked`);
    }
    if (installationRoot) {
      const expectedPath = resolve(installationRoot, ".agents", "skills", entry.name);
      if (canonicalPath(entry.path) !== canonicalPath(expectedPath)) {
        throw new Error(`${scope}/${entry.name}: canonical path is ${entry.path}, expected ${expectedPath}`);
      }
    }
  }
  for (const agent of agentDisplayNames.filter((name) => name !== "Claude Code")) {
    const listedForEverySkill = list.every((entry) => entry.agents.includes(agent));
    if (!listedForEverySkill && !installOutput.includes(agent)) {
      throw new Error(`${scope}: installer did not report universal support for ${agent}`);
    }
  }
}

async function installAndList({ source, cwd, global, env }) {
  const args = skillsArguments(
    "add",
    source,
    "--skill",
    "*",
    "--agent",
    ...agentArguments,
    "--yes",
  );
  if (global) args.push("--global");
  const install = await runCommand(npmCommand(), args, { cwd, env });
  const listArgs = skillsArguments("list", "--json");
  if (global) listArgs.push("--global");
  const result = await runCommand(npmCommand(), listArgs, { cwd, env });
  return { list: parseList(result.stdout), installOutput: install.stdout };
}

export async function smokeInstall(sourceInput = projectRoot) {
  assertNode24();
  const source = sourceInput.startsWith(".")
    ? resolve(projectRoot, sourceInput)
    : sourceInput;
  const expectedNames = await catalogSkillNames();
  const temporary = await mkdtemp(join(tmpdir(), "lode-skills-smoke-"));
  const project = join(temporary, "project");
  const globalProject = join(temporary, "global-project");
  const globalHome = join(temporary, "home");
  const environment = { ...process.env, CI: "1", NO_COLOR: "1", FORCE_COLOR: "0" };
  // Parent `npx --package node@24 --call ...` settings otherwise leak into the
  // nested package runner and make npm treat the parent package as this command's input.
  delete environment.npm_config_call;
  delete environment.npm_config_package;

  try {
    for (const directory of [project, globalProject, globalHome]) {
      await mkdir(directory, { recursive: true });
    }
    await writeFile(resolve(project, "package.json"), '{"private":true}\n');
    await writeFile(resolve(globalProject, "package.json"), '{"private":true}\n');

    const projectResult = await installAndList({ source, cwd: project, global: false, env: environment });
    verifyListing(projectResult.list, expectedNames, "project", projectResult.installOutput, project);

    const globalEnvironment = { ...environment, HOME: globalHome, USERPROFILE: globalHome };
    const globalResult = await installAndList({
      source,
      cwd: globalProject,
      global: true,
      env: globalEnvironment,
    });
    verifyListing(
      globalResult.list,
      expectedNames,
      "global",
      globalResult.installOutput,
      globalHome,
    );

    const invalid = await runCommand(
      npmCommand(),
      skillsArguments(
        "add",
        source,
        "--skill",
        "definitely-not-a-real-skill",
        "--agent",
        "codex",
        "--yes",
      ),
      { cwd: project, env: environment, allowFailure: true },
    );
    if (invalid.code === 0) throw new Error("Invalid skill selection unexpectedly succeeded");

    await runCommand(npmCommand(), skillsArguments("--help"), {
      cwd: project,
      env: environment,
    });
    console.log(
      `Smoke-tested ${projectResult.list.length} skills for project/global installs across ${agentArguments.length} agents`,
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

async function main() {
  await smokeInstall(argumentValue("--source") ?? projectRoot);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
