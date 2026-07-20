---
name: build-phased-plan
description: Create executable implementation plans organized into phases and Markdown-checkbox subtasks, with stable plan/task references, one incremental commit per task, and a mandatory independent AI-agent review gate before each phase completes. Use when asked to build, draft, structure, or revise a delivery plan, engineering plan, migration plan, refactor plan, or other multi-phase work plan that must be commit-ready and independently reviewed.
---

# Build Phased Plan

Create a dependency-aware plan that an implementation agent can execute task by task. Make every task independently verifiable and commit-sized.

## Build the plan

1. Inspect the relevant repository, requirements, and local guidance before planning. Do not invent file paths, commands, or existing behavior.
2. State the objective, scope, assumptions, acceptance criteria, and known risks.
3. Choose a unique three-character plan reference, called `XXX`, from the plan title. Use uppercase ASCII letters or digits, with at least one letter. Record it near the top as `Plan reference: XXX`.
4. Divide the work into ordered phases. Give each phase a concrete outcome and completion criteria.
5. Break each phase into small, dependency-ordered tasks. Format every task as an unchecked Markdown checkbox.
6. Give every task a stable identifier in the form `#XXXPnTm`, where `XXX` is the plan reference, `n` is the phase number, and `m` is the task number within that phase. Start both numbers at 1 and never reuse an identifier.
7. Attach exactly one incremental commit message to every task. Format it as `#XXXPnTm: [imperative message]`. The prefix must exactly match the task identifier.
8. Make the final task of every phase an independent AI-agent review gate. Do not place ordinary implementation tasks after it in that phase.
9. Check the plan for the validation rules below before returning it.

## Write actionable tasks

Each task must identify:

- the intended change or review;
- the concrete files, modules, or artifact area when discoverable;
- the verification or acceptance evidence;
- its exact commit message.

Keep one logical change per task and one task per commit. Split a task when it spans unrelated concerns or cannot be reviewed safely as one commit. Include tests in the same task as the behavior they protect unless a separate test-only task has a clear dependency reason.

Use this shape:

```markdown
- [ ] #APIP1T1 Define the request validation contract in `src/api/validation.ts`.
  - Evidence: Focused validation tests pass for valid and invalid payloads.
  - Commit: `#APIP1T1: Define request validation contract`
```

## Require an independent review gate

End every phase with a task assigned to an AI agent that did not author that phase's changes. Require the reviewer to inspect the phase diff and verification evidence for correctness, regressions, scope control, test adequacy, and compliance with repository guidance.

The review task must:

- be the highest-numbered and final task in the phase;
- depend on all earlier tasks in that phase;
- name the required independent reviewer role, such as `code-reviewer` or `verifier`;
- require actionable findings to be resolved and relevant checks rerun before approval;
- record the review outcome in a durable project artifact when the repository has an established location for it, or in the plan's review record otherwise;
- have its own task-matching incremental commit message;
- block phase completion until the independent agent approves the phase.

Use this shape:

```markdown
- [ ] #APIP1T3 Independent AI review gate (owner: a separate `code-reviewer` agent; depends on #APIP1T1 and #APIP1T2).
  - Review: Inspect the complete Phase 1 diff and evidence; report findings by severity.
  - Exit: Resolve all blocking findings, rerun affected checks, and record approval before Phase 2 starts.
  - Evidence: Review record identifies the agent, findings, resolutions, checks rerun, and final verdict.
  - Commit: `#APIP1T3: Record independent Phase 1 review`
```

If a review produces fixes, amend the review task's single commit only while it remains local and unshared. Otherwise add a new remediation task and commit in the same phase, then run a new final independent review task with the next task number. Never mark the phase complete with unresolved blocking findings.

## Use this output template

```markdown
# <Plan title>

Plan reference: XXX

## Objective

<Desired outcome>

## Scope

- In: <included work>
- Out: <excluded work>

## Acceptance criteria

- <observable success condition>

## Assumptions and risks

- <assumption or risk with mitigation>

## Phase 1 — <phase outcome>

Completion criteria: <observable phase exit condition, including independent approval>

- [ ] #XXXP1T1 <task>
  - Evidence: <verification>
  - Commit: `#XXXP1T1: <imperative message>`
- [ ] #XXXP1T2 Independent AI review gate (owner: a separate `<reviewer-role>` agent; depends on #XXXP1T1).
  - Review: <review scope>
  - Exit: <finding-resolution and approval requirements>
  - Evidence: <durable review record and final verdict>
  - Commit: `#XXXP1T2: Record independent Phase 1 review`

## Phase 2 — <phase outcome>

Completion criteria: <observable phase exit condition, including independent approval>

- [ ] #XXXP2T1 <task>
  - Evidence: <verification>
  - Commit: `#XXXP2T1: <imperative message>`
- [ ] #XXXP2T2 Independent AI review gate (owner: a separate `<reviewer-role>` agent; depends on #XXXP2T1).
  - Review: <review scope>
  - Exit: <finding-resolution and approval requirements>
  - Evidence: <durable review record and final verdict>
  - Commit: `#XXXP2T2: Record independent Phase 2 review`
```

Add or remove phases and tasks to fit the work. Do not emit placeholder text in the final plan.

## Validate before delivery

Confirm all of the following:

- Every task line begins with `- [ ]`.
- Every task identifier matches `#XXXPnTm` and uses the declared plan reference.
- Phase and task numbering is consecutive.
- Every task has exactly one `Commit:` entry whose prefix exactly matches its task identifier.
- Each task is small, ordered, actionable, and independently verifiable.
- The final task in every phase is an independent AI-agent review gate.
- Each review gate blocks the next phase until findings are resolved, checks are rerun, and approval is recorded.
- Phase completion criteria include independent approval.
- No task depends on work scheduled in a later phase.

Return the plan in Markdown. Save it only when the user or repository workflow specifies a plan-file location; otherwise present it directly.
