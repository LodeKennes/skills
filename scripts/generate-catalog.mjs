import { readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  assertNode24,
  parseFrontmatter,
  projectRoot,
  readJson,
  repositoryWebUrl,
} from "./lib.mjs";

const CATALOG_START = "<!-- catalog:start -->";
const CATALOG_END = "<!-- catalog:end -->";
const ATTRIBUTION_START = "<!-- attribution:start -->";
const ATTRIBUTION_END = "<!-- attribution:end -->";

function escapeCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

function replaceSection(document, start, end, content) {
  const startIndex = document.indexOf(start);
  const endIndex = document.indexOf(end);
  if (startIndex < 0 || endIndex < 0 || endIndex <= startIndex) {
    throw new Error(`README is missing generated section markers ${start} / ${end}`);
  }
  return `${document.slice(0, startIndex + start.length)}\n${content}\n${document.slice(endIndex)}`;
}

export async function collectCatalog(root, lock) {
  const upstreamByName = new Map();
  for (const source of lock.sources) {
    for (const skill of source.skills) upstreamByName.set(skill.name, { source, skill });
  }

  const entries = [];
  const directories = await readdir(resolve(root, "skills"), { withFileTypes: true });
  for (const directory of directories.filter((entry) => entry.isDirectory())) {
    const skillFile = resolve(root, "skills", directory.name, "SKILL.md");
    const { frontmatter } = parseFrontmatter(await readFile(skillFile, "utf8"), skillFile);
    const upstream = upstreamByName.get(frontmatter.name);
    entries.push({
      name: frontmatter.name,
      description: frontmatter.description,
      agents: upstream?.skill.agents ?? lock.testedAgents,
      upstream,
    });
  }
  return entries.sort((left, right) => left.name.localeCompare(right.name));
}

function compatibility(entry, testedAgents) {
  const expected = [...testedAgents].sort().join(",");
  const actual = [...entry.agents].sort().join(",");
  return expected === actual ? "All tested agents" : entry.agents.join(", ");
}

export function renderReadme(readme, entries, lock) {
  const catalogRows = entries.map((entry) => {
    const origin = entry.upstream ? entry.upstream.source.id : "Personal";
    return `| [${escapeCell(entry.name)}](skills/${entry.name}/SKILL.md) | ${escapeCell(origin)} | ${escapeCell(compatibility(entry, lock.testedAgents))} | ${escapeCell(entry.description)} |`;
  });
  const catalog = [
    "| Skill | Origin | Compatibility | Description |",
    "| --- | --- | --- | --- |",
    ...catalogRows,
  ].join("\n");

  const attributionRows = entries.map((entry) => {
    if (!entry.upstream) {
      return `| ${escapeCell(entry.name)} | Lode Kennes | Local | MIT |`;
    }
    const { source, skill } = entry.upstream;
    const base = repositoryWebUrl(source.repository);
    const sourceLink = `[${source.id}](${base}/tree/${source.commit}/${skill.sourcePath})`;
    const license = source.license?.spdx ?? "No explicit license";
    return `| ${escapeCell(entry.name)} | ${sourceLink} | [\`${source.commit.slice(0, 12)}\`](${base}/commit/${source.commit}) | ${escapeCell(license)} |`;
  });
  const attribution = [
    "| Skill | Authoritative source | Revision | License |",
    "| --- | --- | --- | --- |",
    ...attributionRows,
  ].join("\n");

  return replaceSection(
    replaceSection(readme, CATALOG_START, CATALOG_END, catalog),
    ATTRIBUTION_START,
    ATTRIBUTION_END,
    attribution,
  );
}

async function main() {
  assertNode24();
  const readmePath = resolve(projectRoot, "README.md");
  const lock = await readJson(resolve(projectRoot, "upstream-lock.json"));
  const readme = await readFile(readmePath, "utf8");
  const entries = await collectCatalog(projectRoot, lock);
  const generated = renderReadme(readme, entries, lock);
  if (process.argv.includes("--check")) {
    if (generated !== readme) throw new Error("README generated catalog is stale; run npm run catalog");
    console.log(`Verified generated catalog (${entries.length} skills)`);
    return;
  }
  await writeFile(readmePath, generated, "utf8");
  console.log(`Generated catalog for ${entries.length} skills`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
