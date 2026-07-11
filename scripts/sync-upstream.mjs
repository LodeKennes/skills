import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rename,
  rm,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  assertNode24,
  discoverSkills,
  hashDirectory,
  parseFrontmatter,
  pathExists,
  projectRoot,
  readJson,
  runCommand,
  validateRelativeLinks,
  validateUpstreamLock,
  writeJson,
} from "./lib.mjs";

async function checkout(source, revision) {
  const temporary = await mkdtemp(join(tmpdir(), "lode-skills-upstream-"));
  const repository = join(temporary, "repository");
  await runCommand("git", ["init", "--quiet", repository]);
  await runCommand("git", ["-C", repository, "remote", "add", "origin", source.repository]);
  const requested = revision ?? `refs/heads/${source.trackedRef}`;
  await runCommand("git", [
    "-C",
    repository,
    "fetch",
    "--quiet",
    "--depth=1",
    "origin",
    requested,
  ]);
  await runCommand("git", ["-C", repository, "checkout", "--quiet", "--detach", "FETCH_HEAD"]);
  const { stdout } = await runCommand("git", ["-C", repository, "rev-parse", "HEAD"]);
  return { temporary, repository, commit: stdout.trim() };
}

async function inspectSource(source, repository, stageRoot, update) {
  const stagedSkills = [];
  const selectedNames = new Set(source.skills.map((skill) => skill.name));
  const discovered = await discoverSkills(resolve(repository, "skills"));
  const newlyDiscovered = discovered
    .filter((skill) => !selectedNames.has(skill.name))
    .map((skill) => `${skill.name} (${skill.relativePath})`);

  for (const skill of source.skills) {
    const sourceDirectory = resolve(repository, skill.sourcePath);
    const skillFile = resolve(sourceDirectory, "SKILL.md");
    if (!(await pathExists(skillFile))) {
      throw new Error(
        `${source.id}: selected skill ${skill.name} disappeared from ${skill.sourcePath}; manual resolution required`,
      );
    }
    const { frontmatter } = parseFrontmatter(await readFile(skillFile, "utf8"), skillFile);
    if (frontmatter.name !== skill.name) {
      throw new Error(
        `${source.id}: ${skill.sourcePath} changed identity from ${skill.name} to ${frontmatter.name}; manual resolution required`,
      );
    }
    const linkErrors = await validateRelativeLinks(sourceDirectory);
    if (linkErrors.length > 0) {
      throw new Error(`${source.id}/${skill.name} is not self-contained:\n${linkErrors.join("\n")}`);
    }
    const upstreamHash = await hashDirectory(sourceDirectory);

    if (update) {
      const stagedDirectory = resolve(stageRoot, "skills", skill.name);
      await mkdir(dirname(stagedDirectory), { recursive: true });
      await cp(sourceDirectory, stagedDirectory, {
        recursive: true,
        preserveTimestamps: true,
        errorOnExist: true,
      });
      stagedSkills.push({ skill, stagedDirectory, upstreamHash });
    } else {
      const localDirectory = resolve(projectRoot, "skills", skill.name);
      if (!(await pathExists(localDirectory))) {
        throw new Error(`${skill.name}: committed mirror is missing`);
      }
      const localHash = await hashDirectory(localDirectory);
      if (skill.hash !== upstreamHash) {
        throw new Error(
          `${skill.name}: lock hash ${skill.hash || "<empty>"} does not match pinned upstream ${upstreamHash}`,
        );
      }
      if (localHash !== upstreamHash) {
        throw new Error(
          `${skill.name}: committed mirror ${localHash} differs from pinned upstream ${upstreamHash}`,
        );
      }
    }
  }

  let stagedLicense;
  if (source.license?.sourcePath) {
    const upstreamLicense = resolve(repository, source.license.sourcePath);
    if (!(await pathExists(upstreamLicense))) {
      throw new Error(`${source.id}: license file disappeared from ${source.license.sourcePath}`);
    }
    if (update) {
      stagedLicense = resolve(stageRoot, source.license.destination);
      await mkdir(dirname(stagedLicense), { recursive: true });
      await cp(upstreamLicense, stagedLicense, { errorOnExist: true });
    } else {
      const localLicense = resolve(projectRoot, source.license.destination);
      if (!(await pathExists(localLicense))) {
        throw new Error(`${source.id}: committed license copy is missing`);
      }
      const [upstreamContent, localContent] = await Promise.all([
        readFile(upstreamLicense),
        readFile(localLicense),
      ]);
      if (!upstreamContent.equals(localContent)) {
        throw new Error(`${source.id}: committed license differs from pinned upstream`);
      }
    }
  }

  return { stagedSkills, stagedLicense, newlyDiscovered };
}

export async function synchronize({ update }) {
  assertNode24();
  const lockPath = resolve(projectRoot, "upstream-lock.json");
  const lock = await readJson(lockPath);
  const lockErrors = validateUpstreamLock(lock);
  if (lockErrors.length > 0) throw new Error(lockErrors.join("\n"));
  const stageRoot = update
    ? await mkdtemp(resolve(projectRoot, ".sync-staging-"))
    : undefined;
  const prepared = [];

  try {
    for (const source of lock.sources) {
      const checkoutResult = await checkout(source, update ? undefined : source.commit);
      try {
        const inspection = await inspectSource(
          source,
          checkoutResult.repository,
          stageRoot,
          update,
        );
        prepared.push({ source, commit: checkoutResult.commit, ...inspection });
      } finally {
        await rm(checkoutResult.temporary, { recursive: true, force: true });
      }
    }

    if (update) {
      for (const item of prepared) {
        item.source.commit = item.commit;
        for (const staged of item.stagedSkills) {
          const destination = resolve(projectRoot, "skills", staged.skill.name);
          await rm(destination, { recursive: true, force: true });
          await mkdir(dirname(destination), { recursive: true });
          await rename(staged.stagedDirectory, destination);
          staged.skill.hash = staged.upstreamHash;
        }
        if (item.stagedLicense) {
          const destination = resolve(projectRoot, item.source.license.destination);
          await rm(destination, { force: true });
          await mkdir(dirname(destination), { recursive: true });
          await rename(item.stagedLicense, destination);
        }
      }
      await writeJson(lockPath, lock);
    }

    for (const item of prepared) {
      console.log(
        `${update ? "Synchronized" : "Verified"} ${item.source.id} at ${item.commit.slice(0, 12)} (${item.source.skills.length} selected skills)`,
      );
      if (item.newlyDiscovered.length > 0) {
        console.log(`Unselected upstream skills (${item.newlyDiscovered.length}):`);
        for (const skill of item.newlyDiscovered) console.log(`- ${skill}`);
      }
    }
  } finally {
    if (stageRoot) await rm(stageRoot, { recursive: true, force: true });
  }
}

async function main() {
  const check = process.argv.includes("--check");
  const update = process.argv.includes("--update");
  if (check === update) {
    throw new Error("Choose exactly one mode: --check or --update");
  }
  await synchronize({ update });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
