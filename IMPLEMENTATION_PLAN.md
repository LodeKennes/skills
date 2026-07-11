# Personal Skills Repository Implementation Plan

## 1. Repository baseline

- [x] Preserve the agreed design decisions in repository documentation.
- [x] Replace the current unpublished history with one clean initial commit on `master` only after every local check passes.
- [x] Remove tracked `.agents/` content from the publishable tree and ignore future local agent installations.
- [x] Remove the empty `skills/.gitkeep` placeholder once real skills exist.
- [x] Ignore consumer-generated `skills-lock.json` without ignoring the committed `upstream-lock.json`.
- [x] Target Node.js 24 LTS and npm as the maintenance command surface.
- [x] Keep repository maintenance tooling free of runtime and development dependencies.

## 2. Canonical skill catalog

- [x] Use `skills/<skill-name>/SKILL.md` as the only installable source layout.
- [x] Create the published personal skill `hello-lode` with only `name` and `description` frontmatter.
- [x] Make `hello-lode` report that Lode's collection is installed and identify the current agent/workspace when known.
- [x] Mirror these selected skills from `mattpocock/skills`:
  - [x] `grill-me`
  - [x] `grilling`
  - [x] `writing-great-skills`
  - [x] `code-review`
  - [x] `diagnosing-bugs`
  - [x] `tdd`
  - [x] `research`
  - [x] `handoff`
- [x] Preserve every mirrored skill byte-for-byte from its pinned upstream commit.
- [x] Preserve every file contained by each selected upstream skill directory.
- [x] Reject upstream skill content that depends on files outside its own directory.
- [x] Record `grilling` as the required companion dependency of `grill-me`.

## 3. Upstream provenance and synchronization

- [x] Commit a human-readable `upstream-lock.json` as the source-selection and resolved-revision record.
- [x] Record upstream repository URL, tracked ref, exact commit, source path, destination name, content hash, dependency list, supported agents, and license status.
- [x] Permit `null` license values while preserving attribution and documenting the accepted redistribution risk.
- [x] Copy applicable upstream license text into a third-party license directory without treating it as part of a mirrored skill.
- [x] Implement a dependency-free Node.js synchronization command.
- [x] Make synchronization clone or fetch into a temporary directory and leave no residue.
- [x] Reject duplicate declared skill names instead of renaming or namespacing them.
- [x] Reject unsafe symlinks and path traversal.
- [x] Refuse silent deletion or renaming when a selected upstream skill disappears.
- [x] Support a check mode that proves committed mirrors match the pinned revision without rewriting files.
- [x] Support an update mode that resolves the tracked upstream ref and refreshes mirrors plus lock metadata.
- [x] Ensure newly discovered upstream skills are reported but never selected automatically.

## 4. Validation and generated documentation

- [x] Implement a dependency-free Node.js validator using Node's built-in APIs.
- [x] Validate required `SKILL.md` files and YAML frontmatter delimiters.
- [x] Validate lowercase hyphenated names and matching directory names.
- [x] Validate non-empty descriptions.
- [x] Validate globally unique declared names.
- [x] Validate dependency closure for selected skills.
- [x] Validate self-contained relative Markdown references.
- [x] Validate that generated files are current.
- [x] Generate the README skill catalog from `SKILL.md` frontmatter and `upstream-lock.json`.
- [x] Generate an attribution table showing personal versus upstream ownership, compatibility, source, revision, and license.
- [x] Keep README introduction, policy, installation, maintenance, and legal-risk prose handwritten.
- [x] Document project, global, selected-skill, agent-specific, and install-all commands using `npx skills@latest`.
- [x] License original skills and repository tooling under MIT while excluding mirrored third-party content from relicensing.

## 5. Automated tests and local quality gates

- [x] Use `node:test` for maintenance-tool regression tests.
- [x] Test frontmatter parsing and invalid skill rejection.
- [x] Test duplicate-name failure.
- [x] Test missing dependency failure.
- [x] Test escaping-reference and symlink rejection.
- [x] Test deterministic directory hashing.
- [x] Test generated catalog determinism.
- [x] Run syntax checks for every repository-owned JavaScript file.
- [x] Run the complete test suite.
- [x] Run repository validation.
- [x] Run pinned upstream mirror-integrity checks.
- [x] Regenerate documentation and prove the worktree remains unchanged.

## 6. Installer smoke testing

- [x] Test installation from the local repository with `npx skills@latest` in an isolated project directory.
- [x] Test isolated global installation by overriding `HOME`.
- [x] Verify discovery/linking for Codex.
- [x] Verify discovery/linking for Claude Code.
- [x] Verify discovery/linking for Cursor.
- [x] Verify discovery/linking for Gemini CLI.
- [x] Verify discovery/linking for GitHub Copilot.
- [x] Verify discovery/linking for OpenCode.
- [x] Test an invalid skill selection and require a non-zero exit.
- [x] Test `npx skills@latest --help` as the CLI help path.

## 7. GitHub automation

- [x] Add pull-request CI on Node.js 24 for tests, validation, mirror integrity, generated-file freshness, and installer smoke tests.
- [x] Add a weekly scheduled upstream-update workflow.
- [x] Make the updater create a reviewable branch and pull request rather than writing to `master`.
- [x] Ensure update pull requests show mirrored changes, resolved commits, newly discovered skills, and dependency changes.
- [x] Prevent automatic deletion when upstream content disappears or changes identity.
- [x] Avoid automatic merge of upstream update pull requests.
- [x] Use repository-scoped GitHub token permissions and no personal token.

## 8. Review, history, and publication

- [x] Review the complete diff against this plan and the confirmed design.
- [x] Run a runtime debugging audit with at least three explicit hypotheses and evidence.
- [x] Resolve all actionable review and audit findings.
- [x] Confirm no unrelated or local-only files are staged.
- [x] Rewrite unpublished history to one clean `master` commit using the Lore commit protocol.
- [x] Create the public `LodeKennes/skills` GitHub repository.
- [x] Push `master` and set it as the default branch.
- [x] Enable GitHub Actions permissions required for updater pull requests.
- [x] Protect `master` with required pull requests and passing CI, administrator bypass, and blocked force-push/deletion.
- [x] Verify the public repository contents and workflow visibility.

## 9. Remote manual QA and completion

- [x] Install interactively/selectively from `LodeKennes/skills` into an isolated project.
- [x] Install from `LodeKennes/skills` into an isolated global home.
- [x] Verify `hello-lode` and all eight mirrored skills are discoverable from the remote source.
- [x] Verify the six-agent support matrix from the remote source.
- [x] Confirm GitHub Actions pass on the published commit.
- [x] Re-read every checkbox and leave none incomplete without an explicit, evidenced blocker.

## Execution evidence

- Local deterministic gate: 12 tests passed; 9 skills validated; pinned upstream commit `391a2701dd94` matched all 8 mirror hashes; generated README was current.
- Local manual QA: project and isolated-global installs found exactly 9 skills across Codex, Claude Code, Cursor, Gemini CLI, GitHub Copilot, and OpenCode; invalid selection failed; CLI help succeeded.
- Idempotence: synchronization plus catalog generation produced identical before/after content fingerprints (`4cf66b3a3a287e34a861e3a53bafa922a2952f8577604fcded7599b9d4d295e6`).
- Debug H1, missing global agent parents: refuted because Claude's directory and links were created and the other five agents were reported as universal consumers.
- Debug H2, leaked host-global state: refuted because every global path stayed under the isolated temporary `HOME`.
- Debug H3, incorrect agent identifiers: refuted because the installer named all six requested agents in its successful summary.
- Debug H4, incomplete global list semantics: confirmed because JSON enumerated only Claude's symlink while the installer reported five universal canonical consumers; fixed with scope-aware verification and a red-to-green regression test.
- Published CI audit: the first Ubuntu run exposed the same universal-consumer semantics in project scope; a second red-to-green regression generalized verification across both scopes and canonicalized macOS `/private` path aliases.
- Review fallback: the current native-agent tool cannot supply the required installed role type, so goal, QA, code-quality, security, and context lanes were executed directly. Findings fixed before publication: remote smoke now requires the local nine-skill set, lock paths/clone URLs are constrained against traversal and Git transport execution, and GitHub actions are pinned to immutable revisions.
