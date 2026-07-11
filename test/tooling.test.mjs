import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { collectCatalog, renderReadme } from "../scripts/generate-catalog.mjs";
import { hashDirectory, parseFrontmatter, validateUpstreamLock } from "../scripts/lib.mjs";
import { catalogSkillNames, verifyListing } from "../scripts/smoke-install.mjs";
import { validateSkillSet } from "../scripts/validate.mjs";

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "lode-skills-test-"));
  await mkdir(resolve(root, "skills"), { recursive: true });
  return root;
}

async function addSkill(root, directory, name = directory, body = "Follow the workflow.\n") {
  const skillRoot = resolve(root, "skills", directory);
  await mkdir(skillRoot, { recursive: true });
  await writeFile(
    resolve(skillRoot, "SKILL.md"),
    `---\nname: ${name}\ndescription: Test ${name}.\n---\n\n${body}`,
  );
  return skillRoot;
}

function emptyLock() {
  return { version: 1, testedAgents: ["codex"], sources: [] };
}

test("frontmatter parser reads required fields", () => {
  const parsed = parseFrontmatter('---\nname: hello\ndescription: "Hello: world"\n---\nBody\n');
  assert.equal(parsed.frontmatter.name, "hello");
  assert.equal(parsed.frontmatter.description, "Hello: world");
  assert.equal(parsed.body, "Body\n");
});

test("frontmatter parser rejects missing delimiters", () => {
  assert.throws(() => parseFrontmatter("name: broken\n"), /missing YAML frontmatter/);
});

test("directory hashes are deterministic and content-sensitive", async () => {
  const root = await fixture();
  try {
    const skill = await addSkill(root, "alpha");
    const first = await hashDirectory(skill);
    const second = await hashDirectory(skill);
    assert.equal(first, second);
    await writeFile(resolve(skill, "extra.txt"), "changed\n");
    assert.notEqual(await hashDirectory(skill), first);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("validation rejects duplicate declared names", async () => {
  const root = await fixture();
  try {
    await addSkill(root, "alpha", "duplicate");
    await addSkill(root, "beta", "duplicate");
    const { errors } = await validateSkillSet(root, emptyLock());
    assert.ok(errors.some((error) => error.includes("duplicate declared skill name")));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("validation rejects missing dependency closure", async () => {
  const root = await fixture();
  try {
    const skill = await addSkill(root, "alpha");
    const hash = await hashDirectory(skill);
    const lock = {
      version: 1,
      testedAgents: ["codex"],
      sources: [
        {
          id: "fixture",
          skills: [
            { name: "alpha", hash, dependencies: ["beta"], agents: ["codex"] },
          ],
        },
      ],
    };
    const { errors } = await validateSkillSet(root, lock);
    assert.ok(errors.includes("alpha: missing dependency beta"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("validation rejects references escaping a skill", async () => {
  const root = await fixture();
  try {
    await addSkill(root, "alpha", "alpha", "Read [outside](../outside.md).\n");
    await writeFile(resolve(root, "skills", "outside.md"), "outside\n");
    const { errors } = await validateSkillSet(root, emptyLock());
    assert.ok(errors.some((error) => error.includes("reference escapes skill directory")));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("validation rejects symbolic links", async (context) => {
  const root = await fixture();
  try {
    const skill = await addSkill(root, "alpha");
    try {
      await symlink(resolve(skill, "SKILL.md"), resolve(skill, "linked.md"));
    } catch (error) {
      if (error.code === "EPERM") {
        context.skip("symbolic links are unavailable on this platform");
        return;
      }
      throw error;
    }
    const { errors } = await validateSkillSet(root, emptyLock());
    assert.ok(errors.some((error) => error.includes("Unsafe symbolic link")));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("catalog generation is deterministic", async () => {
  const root = await fixture();
  try {
    await addSkill(root, "beta");
    await addSkill(root, "alpha");
    const lock = emptyLock();
    const entries = await collectCatalog(root, lock);
    const readme = [
      "# Fixture",
      "<!-- catalog:start -->",
      "old",
      "<!-- catalog:end -->",
      "<!-- attribution:start -->",
      "old",
      "<!-- attribution:end -->",
      "",
    ].join("\n");
    const first = renderReadme(readme, entries, lock);
    assert.equal(renderReadme(first, entries, lock), first);
    assert.ok(first.indexOf("alpha") < first.indexOf("beta"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("global verification recognizes universal agents without redundant links", () => {
  const listing = [
    {
      name: "alpha",
      path: "/tmp/home/.agents/skills/alpha",
      scope: "global",
      agents: ["Claude Code"],
    },
  ];
  const installOutput = "universal: Codex, Cursor, Gemini CLI, GitHub Copilot, OpenCode\nsymlink → Claude Code";
  assert.doesNotThrow(() =>
    verifyListing(listing, ["alpha"], "global", installOutput, "/tmp/home"),
  );
});

test("project verification recognizes universal agents without redundant links", () => {
  const listing = [
    {
      name: "alpha",
      path: "/tmp/project/.agents/skills/alpha",
      scope: "project",
      agents: ["Claude Code"],
    },
  ];
  const installOutput = "universal: Codex, Cursor, Gemini CLI, GitHub Copilot, OpenCode\nsymlink → Claude Code";
  assert.doesNotThrow(() =>
    verifyListing(listing, ["alpha"], "project", installOutput, "/tmp/project"),
  );
});

test("remote smoke expectations come from the local catalog", async () => {
  const root = await fixture();
  try {
    await addSkill(root, "beta");
    await addSkill(root, "alpha");
    assert.deepEqual(await catalogSkillNames(root), ["alpha", "beta"]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("upstream lock rejects traversal paths and unsafe clone URLs", () => {
  const lock = {
    version: 1,
    testedAgents: ["codex"],
    sources: [
      {
        id: "unsafe-source",
        repository: "ext::sh -c exploit",
        trackedRef: "main",
        commit: "a".repeat(40),
        license: {
          sourcePath: "LICENSE",
          destination: "../LICENSE",
        },
        skills: [
          {
            name: "unsafe-skill",
            sourcePath: "../../outside",
            hash: "sha256:fixture",
            dependencies: [],
            agents: ["codex"],
          },
        ],
      },
    ],
  };
  const errors = validateUpstreamLock(lock);
  assert.ok(errors.some((error) => error.includes("HTTPS GitHub clone URL")));
  assert.ok(errors.some((error) => error.includes("unsafe source path")));
  assert.ok(errors.some((error) => error.includes("unsafe license destination")));
});
