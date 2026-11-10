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
| [banner-design](skills/banner-design/SKILL.md) | ui-ux-pro-max-skill | All tested agents | Design banners for social media, ads, website heroes, creative assets, and print. Multiple art direction options with optional generated or supplied visuals. Actions: design, create, generate banner. Platforms: Facebook, Twitter/X, LinkedIn, YouTube, Instagram, Google Display, website hero, print. Styles: minimalist, gradient, bold typography, photo-based, illustrated, geometric, retro, glassmorphism, 3D, neon, duotone, editorial, collage. |
| [brand](skills/brand/SKILL.md) | ui-ux-pro-max-skill | All tested agents | Brand voice, visual identity, messaging frameworks, asset management, brand consistency. Activate for branded content, tone of voice, marketing assets, brand compliance, style guides. |
| [build-phased-plan](skills/build-phased-plan/SKILL.md) | Personal | All tested agents | Dependency-graph planning for parallel implementation. Use when drafting an engineering delivery plan, converting a sequential plan into concurrent workstreams, or revising a plan after dependencies change. |
| [code-review](skills/code-review/SKILL.md) | mattpocock-skills | All tested agents | Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes: Standards (does the code follow this repo's documented coding standards?) and Spec (does the code match what the originating issue/spec asked for?). Runs both reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, work-in-progress changes, or asks to "review since X". |
| [design](skills/design/SKILL.md) | ui-ux-pro-max-skill | All tested agents | Comprehensive design skill: brand identity, design tokens, UI styling, logo generation (55 styles, Gemini, Atlas Cloud, or MuAPI AI), corporate identity program (50 deliverables, CIP mockups), HTML presentations (Chart.js), banner design (22 styles, social/ads/web/print), icon design (15 styles, SVG, Gemini 3.1 Pro), social photos (HTML→screenshot, multi-platform). Actions: design logo, create CIP, generate mockups, build slides, design banner, generate icon, create social photos, social media images, brand identity, design system. Platforms: Facebook, Twitter, LinkedIn, YouTube, Instagram, Pinterest, TikTok, Threads, Google Ads. |
| [design-system](skills/design-system/SKILL.md) | ui-ux-pro-max-skill | All tested agents | Token architecture, component specifications, and slide generation. Three-layer tokens (primitive→semantic→component), CSS variables, spacing/typography scales, component specs, strategic slide creation. Use for design tokens, systematic design, brand-compliant presentations. |
| [diagnosing-bugs](skills/diagnosing-bugs/SKILL.md) | mattpocock-skills | All tested agents | Diagnosis loop for hard bugs and performance regressions. Use when the user says "diagnose"/"debug this", or reports something broken/throwing/failing/slow. |
| [grill-me](skills/grill-me/SKILL.md) | mattpocock-skills | All tested agents | A relentless interview to sharpen a plan or design. |
| [grilling](skills/grilling/SKILL.md) | mattpocock-skills | All tested agents | Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases. |
| [handoff](skills/handoff/SKILL.md) | mattpocock-skills | All tested agents | Compact the current conversation into a handoff document for another agent to pick up. |
| [hello-lode](skills/hello-lode/SKILL.md) | Personal | All tested agents | Confirm that Lode's personal skill collection is installed. Use when checking a fresh project or global installation from LodeKennes/skills. |
| [ponytail](skills/ponytail/SKILL.md) | ponytail | All tested agents | Lazy senior dev mode: the smallest change that fully solves the task, and a reply a busy human understands in one read. Use on any coding task (writing, fixing, refactoring, reviewing, choosing dependencies) and when the user says "ponytail", "be lazy", "simplest solution", "yagni", or complains about over-engineering or bloat. Levels: lite, full (default), ultra. |
| [research](skills/research/SKILL.md) | mattpocock-skills | All tested agents | Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent. |
| [slides](skills/slides/SKILL.md) | ui-ux-pro-max-skill | All tested agents | Create strategic HTML presentations with Chart.js, design tokens, responsive layouts, copywriting formulas, and contextual slide strategies. |
| [tdd](skills/tdd/SKILL.md) | mattpocock-skills | All tested agents | Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests. |
| [ui-styling](skills/ui-styling/SKILL.md) | ui-ux-pro-max-skill | All tested agents | Create beautiful, accessible user interfaces with shadcn/ui components (built on Radix UI + Tailwind), Tailwind CSS utility-first styling, and canvas-based visual designs. Use when building user interfaces, implementing design systems, creating responsive layouts, adding accessible components (dialogs, dropdowns, forms, tables), customizing themes and colors, implementing dark mode, generating visual designs and posters, or establishing consistent styling patterns across applications. |
| [ui-ux-pro-max](skills/ui-ux-pro-max/SKILL.md) | ui-ux-pro-max-skill | All tested agents | UI/UX design intelligence for web, mobile, and desktop. This skill should be used when designing, building, reviewing, or fixing interfaces, including pages, components, design systems, accessibility, interaction, responsive layout, typography, color, charts, and stack-specific UI implementation. Searchable local data: 80 searchable styles (51 active), 192 product palettes and reasoning profiles, 74 font pairings, 120 UX guidelines, 105 icons, 17 GSAP presets, 25 chart types, and 22 stacks. |
| [website-ux](skills/website-ux/SKILL.md) | Personal | All tested agents | Website UX specialist for designing, auditing, and improving public-facing websites around visitor intent, comprehension, information architecture, navigation, findability, trust, conversion, forms, content hierarchy, mobile usability, accessibility, and perceived performance. Use when building or reviewing homepages, marketing sites, landing pages, pricing pages, signup/contact flows, ecommerce pages, documentation sites, or other websites where users must quickly understand where they are, find what they need, and complete a goal. Prefer this skill over visual-design skills when the question is whether the website works well for users rather than how it looks. |
| [writing-for-agents](skills/writing-for-agents/SKILL.md) | mattpocock-skills | All tested agents | Writing documents for agents. Use when creating or editing skills, or modifying AGENTS.md or CLAUDE.md. |
<!-- catalog:end -->

## Provenance

Personal skills are maintained here. Selected upstream skills are pinned to an exact commit, copied without modification, and updated only through reviewable pull requests. Duplicate names, missing companion skills, escaping file references, and silent upstream removals fail validation.

`upstream-lock.json` records publisher provenance. A `skills-lock.json` belongs to a consuming project and is intentionally ignored here.

<!-- attribution:start -->
| Skill | Authoritative source | Revision | License |
| --- | --- | --- | --- |
| banner-design | [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/6ae86f61f520d6ca229d2f40e070410638c908c5/.claude/skills/banner-design) | [`6ae86f61f520`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/commit/6ae86f61f520d6ca229d2f40e070410638c908c5) | MIT |
| brand | [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/6ae86f61f520d6ca229d2f40e070410638c908c5/.claude/skills/brand) | [`6ae86f61f520`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/commit/6ae86f61f520d6ca229d2f40e070410638c908c5) | MIT |
| build-phased-plan | Lode Kennes | Local | MIT |
| code-review | [mattpocock-skills](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/code-review) | [`4ae2317ddb22`](https://github.com/mattpocock/skills/commit/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d) | MIT |
| design | [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/6ae86f61f520d6ca229d2f40e070410638c908c5/.claude/skills/design) | [`6ae86f61f520`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/commit/6ae86f61f520d6ca229d2f40e070410638c908c5) | MIT |
| design-system | [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/6ae86f61f520d6ca229d2f40e070410638c908c5/.claude/skills/design-system) | [`6ae86f61f520`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/commit/6ae86f61f520d6ca229d2f40e070410638c908c5) | MIT |
| diagnosing-bugs | [mattpocock-skills](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/diagnosing-bugs) | [`4ae2317ddb22`](https://github.com/mattpocock/skills/commit/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d) | MIT |
| grill-me | [mattpocock-skills](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/productivity/grill-me) | [`4ae2317ddb22`](https://github.com/mattpocock/skills/commit/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d) | MIT |
| grilling | [mattpocock-skills](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/productivity/grilling) | [`4ae2317ddb22`](https://github.com/mattpocock/skills/commit/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d) | MIT |
| handoff | [mattpocock-skills](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/productivity/handoff) | [`4ae2317ddb22`](https://github.com/mattpocock/skills/commit/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d) | MIT |
| hello-lode | Lode Kennes | Local | MIT |
| ponytail | [ponytail](https://github.com/DietrichGebert/ponytail/tree/96608e078b2d5ea607c5c3b8b5a54d1c1fba6846/skills/ponytail) | [`96608e078b2d`](https://github.com/DietrichGebert/ponytail/commit/96608e078b2d5ea607c5c3b8b5a54d1c1fba6846) | MIT |
| research | [mattpocock-skills](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/research) | [`4ae2317ddb22`](https://github.com/mattpocock/skills/commit/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d) | MIT |
| slides | [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/6ae86f61f520d6ca229d2f40e070410638c908c5/.claude/skills/slides) | [`6ae86f61f520`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/commit/6ae86f61f520d6ca229d2f40e070410638c908c5) | MIT |
| tdd | [mattpocock-skills](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/engineering/tdd) | [`4ae2317ddb22`](https://github.com/mattpocock/skills/commit/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d) | MIT |
| ui-styling | [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/6ae86f61f520d6ca229d2f40e070410638c908c5/.claude/skills/ui-styling) | [`6ae86f61f520`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/commit/6ae86f61f520d6ca229d2f40e070410638c908c5) | MIT |
| ui-ux-pro-max | [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/tree/6ae86f61f520d6ca229d2f40e070410638c908c5/.claude/skills/ui-ux-pro-max) | [`6ae86f61f520`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/commit/6ae86f61f520d6ca229d2f40e070410638c908c5) | MIT |
| website-ux | Lode Kennes | Local | MIT |
| writing-for-agents | [mattpocock-skills](https://github.com/mattpocock/skills/tree/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d/skills/productivity/writing-for-agents) | [`4ae2317ddb22`](https://github.com/mattpocock/skills/commit/4ae2317ddb22b046e26455e4f9c9b3aaaf62212d) | MIT |
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
