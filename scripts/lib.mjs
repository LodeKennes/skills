import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import {
  lstat,
  readFile,
  readdir,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = fileURLToPath(new URL("..", import.meta.url));
export const skillNamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const commitPattern = /^[0-9a-f]{40}$/;

export function assertNode24() {
  const major = Number.parseInt(process.versions.node.split(".")[0], 10);
  if (major < 24) {
    throw new Error(`Node.js 24 or newer is required; found ${process.versions.node}`);
  }
}

export async function pathExists(target) {
  try {
    await stat(target);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

export async function readJson(target) {
  return JSON.parse(await readFile(target, "utf8"));
}

export async function writeJson(target, value) {
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return JSON.parse(trimmed);
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replaceAll("''", "'");
  }
  return trimmed;
}

export function parseFrontmatter(content, source = "SKILL.md") {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    throw new Error(`${source}: missing YAML frontmatter delimiters`);
  }

  const frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$/);
    if (field) frontmatter[field[1]] = parseScalar(field[2] ?? "");
  }
  return { frontmatter, body: content.slice(match[0].length) };
}

export function toPosixPath(target) {
  return target.split(sep).join("/");
}

export async function walkFiles(root) {
  const files = [];

  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const absolute = resolve(directory, entry.name);
      const info = await lstat(absolute);
      if (info.isSymbolicLink()) {
        throw new Error(`Unsafe symbolic link: ${toPosixPath(relative(root, absolute))}`);
      }
      if (info.isDirectory()) await visit(absolute);
      else if (info.isFile()) files.push({ absolute, info });
    }
  }

  await visit(root);
  return files;
}

export async function hashDirectory(root) {
  const hash = createHash("sha256");
  for (const { absolute, info } of await walkFiles(root)) {
    const name = toPosixPath(relative(root, absolute));
    const content = await readFile(absolute);
    const executable = info.mode & 0o111 ? "x" : "-";
    hash.update(`${name}\0${executable}\0${content.length}\0`);
    hash.update(content);
    hash.update("\0");
  }
  return `sha256:${hash.digest("hex")}`;
}

export async function discoverSkills(root) {
  const found = [];

  async function visit(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const absolute = resolve(directory, entry.name);
      const skillFile = resolve(absolute, "SKILL.md");
      if (await pathExists(skillFile)) {
        const { frontmatter } = parseFrontmatter(
          await readFile(skillFile, "utf8"),
          skillFile,
        );
        found.push({
          name: frontmatter.name,
          path: absolute,
          relativePath: toPosixPath(relative(root, absolute)),
        });
      } else {
        await visit(absolute);
      }
    }
  }

  await visit(root);
  return found;
}

function markdownTargets(content) {
  const targets = [];
  const inline = /!?\[[^\]]*\]\(([^)]+)\)/g;
  const definitions = /^\s*\[[^\]]+\]:\s*(\S+)/gm;
  for (const matcher of [inline, definitions]) {
    for (const match of content.matchAll(matcher)) {
      let target = match[1].trim().split(/\s+["']/)[0];
      if (target.startsWith("<") && target.endsWith(">")) {
        target = target.slice(1, -1);
      }
      targets.push(target);
    }
  }
  return targets;
}

export async function validateRelativeLinks(skillRoot) {
  const errors = [];
  for (const { absolute } of await walkFiles(skillRoot)) {
    if (!absolute.endsWith(".md")) continue;
    const content = await readFile(absolute, "utf8");
    for (const rawTarget of markdownTargets(content)) {
      if (
        rawTarget === "" ||
        rawTarget.startsWith("#") ||
        rawTarget.startsWith("/") ||
        /^[a-z][a-z0-9+.-]*:/i.test(rawTarget)
      ) {
        continue;
      }
      const pathPart = decodeURIComponent(rawTarget.split("#")[0]);
      if (!pathPart) continue;
      const target = resolve(dirname(absolute), pathPart);
      if (target !== skillRoot && !target.startsWith(`${skillRoot}${sep}`)) {
        errors.push(
          `${toPosixPath(relative(skillRoot, absolute))}: reference escapes skill directory (${rawTarget})`,
        );
      } else if (!(await pathExists(target))) {
        errors.push(
          `${toPosixPath(relative(skillRoot, absolute))}: missing referenced file (${rawTarget})`,
        );
      }
    }
  }
  return errors;
}

export function runCommand(command, args, options = {}) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
      if (options.echo) process.stdout.write(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
      if (options.echo) process.stderr.write(chunk);
    });
    child.on("error", rejectPromise);
    child.on("close", (code) => {
      const result = { code, stdout, stderr };
      if (code === 0 || options.allowFailure) resolvePromise(result);
      else {
        const detail = [stdout.trim(), stderr.trim()].filter(Boolean).join("\n");
        rejectPromise(
          new Error(`${command} ${args.join(" ")} exited ${code}${detail ? `\n${detail}` : ""}`),
        );
      }
    });
  });
}

export function repositoryWebUrl(repository) {
  return repository.replace(/\.git$/, "");
}

function isSafeManifestPath(value) {
  if (typeof value !== "string" || value === "" || value.includes("\\")) return false;
  const parts = value.split("/");
  return !value.startsWith("/") && parts.every((part) => part !== "" && part !== "." && part !== "..");
}

export function validateUpstreamLock(lock) {
  const errors = [];
  if (lock.version !== 1 || !Array.isArray(lock.sources)) {
    return ["upstream-lock.json has an unsupported schema"];
  }
  const testedAgents = Array.isArray(lock.testedAgents) ? lock.testedAgents : [];
  if (testedAgents.length === 0) {
    errors.push("upstream-lock.json must declare testedAgents");
  }

  const names = new Set();
  const sourceIds = new Set();
  for (const source of lock.sources) {
    if (!skillNamePattern.test(source.id ?? "")) errors.push(`Invalid upstream source id ${source.id}`);
    if (sourceIds.has(source.id)) errors.push(`Duplicate upstream source id ${source.id}`);
    sourceIds.add(source.id);
    if (!/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\.git$/.test(source.repository ?? "")) {
      errors.push(`${source.id}: repository must be an HTTPS GitHub clone URL ending in .git`);
    }
    if (!/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(source.trackedRef ?? "")) {
      errors.push(`${source.id}: invalid trackedRef ${source.trackedRef}`);
    }
    if (!commitPattern.test(source.commit ?? "")) errors.push(`${source.id}: commit must be a 40-character SHA`);
    if (!Array.isArray(source.skills)) errors.push(`${source.id}: skills must be an array`);

    if (source.license?.sourcePath && !isSafeManifestPath(source.license.sourcePath)) {
      errors.push(`${source.id}: unsafe license source path ${source.license.sourcePath}`);
    }
    if (source.license?.destination) {
      if (
        !isSafeManifestPath(source.license.destination) ||
        !source.license.destination.startsWith("third-party/licenses/")
      ) {
        errors.push(`${source.id}: unsafe license destination ${source.license.destination}`);
      }
    }

    for (const skill of source.skills ?? []) {
      if (!skillNamePattern.test(skill.name ?? "")) errors.push(`${source.id}: invalid skill name ${skill.name}`);
      if (names.has(skill.name)) errors.push(`Duplicate selected skill name: ${skill.name}`);
      names.add(skill.name);
      if (!isSafeManifestPath(skill.sourcePath)) {
        errors.push(`${source.id}/${skill.name}: unsafe source path ${skill.sourcePath}`);
      }
      if (!Array.isArray(skill.dependencies)) errors.push(`${skill.name}: dependencies must be an array`);
      if (!Array.isArray(skill.agents) || skill.agents.length === 0) {
        errors.push(`${skill.name}: agents must be a non-empty array`);
      } else {
        for (const agent of skill.agents) {
          if (!testedAgents.includes(agent)) {
            errors.push(`${skill.name}: unsupported compatibility value ${agent}`);
          }
        }
      }
    }
  }

  for (const source of lock.sources) {
    for (const skill of source.skills ?? []) {
      for (const dependency of skill.dependencies ?? []) {
        if (!names.has(dependency)) errors.push(`${skill.name}: missing selected dependency ${dependency}`);
      }
    }
  }
  return errors;
}
