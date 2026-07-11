# Lode's Skills

A curated, cross-agent collection of personal skills and pinned, unmodified upstream skills.

## Install

Choose skills and agents interactively for the current project:

```bash
npx skills@latest add LodeKennes/skills
```

Install globally instead:

```bash
npx skills@latest add LodeKennes/skills --global
```

Install selected skills for one agent without prompts:

```bash
npx skills@latest add LodeKennes/skills --skill tdd research --agent codex --yes
```

Install every skill for every detected agent:

```bash
npx skills@latest add LodeKennes/skills --all
npx skills@latest add LodeKennes/skills --global --all
```

The repository verifies installation for Codex, Claude Code, Cursor, Gemini CLI, GitHub Copilot, and OpenCode. Individual skills may support a narrower set, shown in the catalog.

## Catalog

<!-- catalog:start -->
| Skill | Origin | Compatibility | Description |
| --- | --- | --- | --- |
| [code-review](skills/code-review/SKILL.md) | mattpocock-skills | All tested agents | Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes — Standards (does the code follow this repo's documented coding standards?) and Spec (does the code match what the originating issue/PRD asked for?). Runs both reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, work-in-progress changes, or asks to "review since X". |
| [diagnosing-bugs](skills/diagnosing-bugs/SKILL.md) | mattpocock-skills | All tested agents | Diagnosis loop for hard bugs and performance regressions. Use when the user says "diagnose"/"debug this", or reports something broken/throwing/failing/slow. |
| [grill-me](skills/grill-me/SKILL.md) | mattpocock-skills | All tested agents | A relentless interview to sharpen a plan or design. |
| [grilling](skills/grilling/SKILL.md) | mattpocock-skills | All tested agents | Grill the user relentlessly about a plan or design. Use when the user wants to stress-test a plan before building, or uses any 'grill' trigger phrases. |
| [handoff](skills/handoff/SKILL.md) | mattpocock-skills | All tested agents | Compact the current conversation into a handoff document for another agent to pick up. |
| [hello-lode](skills/hello-lode/SKILL.md) | Personal | All tested agents | Confirm that Lode's personal skill collection is installed. Use when checking a fresh project or global installation from LodeKennes/skills. |
| [research](skills/research/SKILL.md) | mattpocock-skills | All tested agents | Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent. |
| [tdd](skills/tdd/SKILL.md) | mattpocock-skills | All tested agents | Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests. |
| [writing-great-skills](skills/writing-great-skills/SKILL.md) | mattpocock-skills | All tested agents | Reference for writing and editing skills well — the vocabulary and principles that make a skill predictable. |
<!-- catalog:end -->

## Provenance

Personal skills are maintained here. Selected upstream skills are pinned to an exact commit, copied without modification, and updated only through reviewable pull requests. Duplicate names, missing companion skills, escaping file references, and silent upstream removals fail validation.

`upstream-lock.json` records publisher provenance. A `skills-lock.json` belongs to a consuming project and is intentionally ignored here.

<!-- attribution:start -->
| Skill | Authoritative source | Revision | License |
| --- | --- | --- | --- |
| code-review | [mattpocock-skills](https://github.com/mattpocock/skills/tree/391a2701dd948f94f56a39f7533f8eea9a859c87/skills/engineering/code-review) | [`391a2701dd94`](https://github.com/mattpocock/skills/commit/391a2701dd948f94f56a39f7533f8eea9a859c87) | MIT |
| diagnosing-bugs | [mattpocock-skills](https://github.com/mattpocock/skills/tree/391a2701dd948f94f56a39f7533f8eea9a859c87/skills/engineering/diagnosing-bugs) | [`391a2701dd94`](https://github.com/mattpocock/skills/commit/391a2701dd948f94f56a39f7533f8eea9a859c87) | MIT |
| grill-me | [mattpocock-skills](https://github.com/mattpocock/skills/tree/391a2701dd948f94f56a39f7533f8eea9a859c87/skills/productivity/grill-me) | [`391a2701dd94`](https://github.com/mattpocock/skills/commit/391a2701dd948f94f56a39f7533f8eea9a859c87) | MIT |
| grilling | [mattpocock-skills](https://github.com/mattpocock/skills/tree/391a2701dd948f94f56a39f7533f8eea9a859c87/skills/productivity/grilling) | [`391a2701dd94`](https://github.com/mattpocock/skills/commit/391a2701dd948f94f56a39f7533f8eea9a859c87) | MIT |
| handoff | [mattpocock-skills](https://github.com/mattpocock/skills/tree/391a2701dd948f94f56a39f7533f8eea9a859c87/skills/productivity/handoff) | [`391a2701dd94`](https://github.com/mattpocock/skills/commit/391a2701dd948f94f56a39f7533f8eea9a859c87) | MIT |
| hello-lode | Lode Kennes | Local | MIT |
| research | [mattpocock-skills](https://github.com/mattpocock/skills/tree/391a2701dd948f94f56a39f7533f8eea9a859c87/skills/engineering/research) | [`391a2701dd94`](https://github.com/mattpocock/skills/commit/391a2701dd948f94f56a39f7533f8eea9a859c87) | MIT |
| tdd | [mattpocock-skills](https://github.com/mattpocock/skills/tree/391a2701dd948f94f56a39f7533f8eea9a859c87/skills/engineering/tdd) | [`391a2701dd94`](https://github.com/mattpocock/skills/commit/391a2701dd948f94f56a39f7533f8eea9a859c87) | MIT |
| writing-great-skills | [mattpocock-skills](https://github.com/mattpocock/skills/tree/391a2701dd948f94f56a39f7533f8eea9a859c87/skills/productivity/writing-great-skills) | [`391a2701dd94`](https://github.com/mattpocock/skills/commit/391a2701dd948f94f56a39f7533f8eea9a859c87) | MIT |
<!-- attribution:end -->

## Maintenance

Node.js 24 LTS is required. The repository has no npm dependencies.

```bash
npm run sync:update   # refresh selected upstream skills and pins
npm run catalog       # regenerate README tables
npm run check         # run all deterministic local checks
npm run smoke         # exercise project and isolated-global installs
```

New upstream skills are never selected automatically. Upstream deletion or renaming requires manual resolution. Weekly automation opens a pull request and never merges it automatically.

## Licensing

Original skills and repository tooling are MIT-licensed under [LICENSE](LICENSE). Mirrored skills retain the licensing status recorded below and in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). An upstream entry may have no explicit license; such content remains attributed but carries redistribution risk.
