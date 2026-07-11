import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { collectCatalog, renderReadme } from "./generate-catalog.mjs";
import {
  assertNode24,
  hashDirectory,
  parseFrontmatter,
  pathExists,
  projectRoot,
  readJson,
  skillNamePattern,
  validateRelativeLinks,
  validateUpstreamLock,
} from "./lib.mjs";

export async function validateSkillSet(root, lock) {
  const errors = [];
  const skillsRoot = resolve(root, "skills");
  const directories = (await readdir(skillsRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name));
  const byName = new Map();

  for (const directory of directories) {
    const skillRoot = resolve(skillsRoot, directory.name);
    const skillFile = resolve(skillRoot, "SKILL.md");
    if (!(await pathExists(skillFile))) {
      errors.push(`${directory.name}: missing SKILL.md`);
      continue;
    }
    try {
      const { frontmatter } = parseFrontmatter(await readFile(skillFile, "utf8"), skillFile);
      if (!frontmatter.name) errors.push(`${directory.name}: frontmatter name is required`);
      if (!frontmatter.description) errors.push(`${directory.name}: frontmatter description is required`);
      if (frontmatter.name && !skillNamePattern.test(frontmatter.name)) {
        errors.push(`${directory.name}: invalid skill name ${frontmatter.name}`);
      }
      if (frontmatter.name !== directory.name) {
        errors.push(`${directory.name}: directory must match declared name ${frontmatter.name}`);
      }
      if (byName.has(frontmatter.name)) {
        errors.push(`${directory.name}: duplicate declared skill name ${frontmatter.name}`);
      } else if (frontmatter.name) {
        byName.set(frontmatter.name, { directory: skillRoot, frontmatter });
      }
      for (const linkError of await validateRelativeLinks(skillRoot)) {
        errors.push(`${directory.name}/${linkError}`);
      }
    } catch (error) {
      errors.push(`${directory.name}: ${error.message}`);
    }
  }

  const selected = new Map();
  const sourceIds = new Set();
  for (const source of lock.sources) {
    if (sourceIds.has(source.id)) errors.push(`Duplicate upstream source id ${source.id}`);
    sourceIds.add(source.id);
    for (const skill of source.skills) {
      if (selected.has(skill.name)) errors.push(`Duplicate locked skill name ${skill.name}`);
      selected.set(skill.name, { source, skill });
      if (!byName.has(skill.name)) {
        errors.push(`${skill.name}: locked upstream mirror is missing`);
        continue;
      }
      if (!skill.hash) {
        errors.push(`${skill.name}: upstream hash is empty`);
      } else {
        try {
          const actualHash = await hashDirectory(byName.get(skill.name).directory);
          if (actualHash !== skill.hash) {
            errors.push(`${skill.name}: local hash ${actualHash} does not match lock ${skill.hash}`);
          }
        } catch (error) {
          errors.push(`${skill.name}: ${error.message}`);
        }
      }
      for (const agent of skill.agents) {
        if (!lock.testedAgents.includes(agent)) {
          errors.push(`${skill.name}: unsupported compatibility value ${agent}`);
        }
      }
    }
  }

  for (const { skill } of selected.values()) {
    for (const dependency of skill.dependencies) {
      if (!selected.has(dependency) && !byName.has(dependency)) {
        errors.push(`${skill.name}: missing dependency ${dependency}`);
      }
    }
  }

  return { errors, skills: byName, selected };
}

export async function validateRepository(root = projectRoot) {
  const errors = [];
  const lock = await readJson(resolve(root, "upstream-lock.json"));
  errors.push(...validateUpstreamLock(lock));

  const skillResult = await validateSkillSet(root, lock);
  errors.push(...skillResult.errors);

  if (await pathExists(resolve(root, "skills-lock.json"))) {
    errors.push("skills-lock.json is consumer state and must not exist in the publisher repository");
  }

  for (const source of lock.sources) {
    if (source.license?.destination && !(await pathExists(resolve(root, source.license.destination)))) {
      errors.push(`${source.id}: missing copied license ${source.license.destination}`);
    }
  }

  try {
    const packageJson = await readJson(resolve(root, "package.json"));
    if (packageJson.engines?.node !== ">=24") errors.push("package.json must require Node.js >=24");
    if (packageJson.dependencies || packageJson.devDependencies) {
      errors.push("package.json must remain dependency-free");
    }
  } catch (error) {
    errors.push(`package.json: ${error.message}`);
  }

  try {
    const readmePath = resolve(root, "README.md");
    const readme = await readFile(readmePath, "utf8");
    const entries = await collectCatalog(root, lock);
    if (renderReadme(readme, entries, lock) !== readme) {
      errors.push("README generated catalog is stale");
    }
  } catch (error) {
    errors.push(`README.md: ${error.message}`);
  }

  return errors;
}

async function main() {
  assertNode24();
  const errors = await validateRepository();
  if (errors.length > 0) {
    for (const error of errors) console.error(`- ${error}`);
    throw new Error(`Validation failed with ${errors.length} error(s)`);
  }
  const count = (await readdir(resolve(projectRoot, "skills"), { withFileTypes: true })).filter(
    (entry) => entry.isDirectory(),
  ).length;
  console.log(`Validated ${count} skills with no errors`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
