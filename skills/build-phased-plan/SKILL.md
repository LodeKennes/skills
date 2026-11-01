---
name: build-phased-plan
description: Dependency-graph planning for parallel implementation. Use when drafting an engineering delivery plan, converting a sequential plan into concurrent workstreams, or revising a plan after dependencies change.
---

# Build Parallel Plans

Build an executable **dependency graph** with bounded task contracts, safe parallel work, and explicit integration. Keep `$build-phased-plan` as the invocation. Planning produces proposed work and gates; execution requires the user's authorization for those actions.

## 1. Ground the outcome

Inspect requirements, repository guidance, relevant code, and existing validation entrypoints. Record the target branch and starting revision. Distinguish observed facts from assumptions; identify external prerequisites and decisions that would change task boundaries.

State the objective, scope, and observable acceptance criteria. Choose the smallest useful plan: one task is valid when the work has no independent branches. Investigate uncertain contracts with a bounded discovery task whose output enables the remaining decomposition.

**Done:** every requested outcome has an acceptance criterion, and every unresolved assumption has an owner and a resolution condition.

## 2. Define task contracts

Choose an unused three-character uppercase alphanumeric plan reference containing a letter. For new tasks allocate append-only IDs such as `#APIT001`. Preserve existing IDs when revising a plan, including legacy `#APIP1T1` IDs; retire superseded IDs with a replacement link.

Write each task as a Markdown checkbox followed by its contract:

```markdown
- [ ] #APIT001 <observable outcome>
  - Owner: <one accountable role>; write scope: <files/modules/artifact area>
  - Inputs / depends on: <task IDs or external conditions, consumed artifacts, release evidence; none for a root>
  - Output: <artifact/interface, compatibility obligations, handoff destination>
  - Acceptance: <check and expected result>; evidence location: <where results will be recorded>
  - Conflicts / resources: <shared write areas, exclusive environments, capacity; none when checked>
  - Delivery: <branch/base and PR grouping, or non-code handoff>; commit: <task-ID-prefixed imperative message, or N/A with reason>
```

Split at independently verifiable outputs. Include behavior and its tests together. Extract a shared interface, fixture, or contract test before its consumers when that unlocks useful parallel work. Each task must be executable from its contract and cited inputs without the planner's conversation.

**Done:** every task has all contract fields, bounded ownership, and observable acceptance evidence; each acceptance criterion maps to tasks and checks.

## 3. Construct the dependency graph

Use `producer -> consumer` edges. Record a prerequisite only when the consumer needs an accepted output or an explicit safety/approval condition, with the artifact and release condition explaining why. List direct prerequisites; derive transitive dependencies rather than copying them into every task.

Keep **resource conflicts** separate: two tasks sharing an editor scope, schema, lockfile, generator, deployment environment, or reviewer may need exclusive access without depending on each other's output. Assign one owner or a scheduling constraint. Separate worktrees isolate checkouts; semantic coupling still needs a contract or integration check.

Treat phases as outcome milestones. Add a milestone barrier only for a stated acceptance or safety requirement; task numbering, headings, and presentation order create no dependencies. For cross-component fan-in, add an integration task with an owner, exact input revisions to record at execution, and combined checks.

Resolve cycles by moving a shared contract earlier, combining inseparable work, or introducing discovery. Read [graph-patterns.md](references/graph-patterns.md) when decomposing coupled components, analyzing bottlenecks, or checking fan-out/fan-in behavior.

**Done:** every prerequisite resolves, every edge has a release condition, the graph has a topological ordering, and every output reaches an acceptance criterion or necessary integration gate. Missing inputs, self-edges, and cycles are explicit blockers to an executable plan.

## 4. Determine readiness and capacity

**Ready** means all required inputs and approvals are accepted. Dispatch additionally requires a free owner, conflict clearance, and resource capacity. Recompute the ready set after each completion or relevant change; release a ready consumer while unrelated work continues. A wave is a schedule illustration, never an implicit barrier.

Name the initial ready tasks and external blockers. State the concurrency cap and its basis: agents, isolated checkouts, review capacity, test environments, or budget. If capacity is unknown, label the assumption; one executor can run the same graph serially.

Identify the longest prerequisite chains and bottlenecks. Estimate a time-based critical path only with defensible task duration ranges; state uncertainty and distinguish this dependency-only lower bound from the resource-constrained schedule. Prioritize ready tasks that unblock the bottleneck, then use task ID to break otherwise equal ties.

**Done:** the initial dispatch set fits ownership and capacity constraints, with a reason for every ready task deferred and every proposed serialization.

## 5. Plan delivery, review, and recovery

Map task outputs to repository delivery units independently of the execution graph. Independent branches may share a known base; short stacks express real code dependencies. Group tasks in one PR only when the resulting change remains coherent and independently reviewable. Keep each implementation task one logical commit where the repository permits it; non-code checks and review gates may use `N/A` instead of synthetic commits.

For concurrent implementation or multiple PRs, read [delivery.md](references/delivery.md) before specifying branch topology, integration ownership, and handoffs. Follow active repository model policy and available orchestration tools for independent reviewers; record an unavailable reviewer as a blocked gate rather than an invented approval.

Specify independent review for each implementation PR (or equivalent change unit) and for integrated milestone behavior. Reviewers inspect requirements, applicable review guidance/skills, exact revisions, and validation evidence. Approval requires disposition of actionable findings and affected checks rerun. Record reviewer identity, reviewed inputs, findings/resolutions, and verdict in the established review record. A relevant input or code change invalidates affected checks and approvals.

On failure, hold affected descendants and retain unrelated accepted work. Assign remediation, update changed contracts/edges, and revalidate affected consumers before release. Record safe retry or rollback conditions for external side effects. A join accepts all required inputs; a failed or skipped prerequisite requires explicit replanning.

**Done:** every delivery unit has a base/handoff, reviewer gate, and integration destination; each milestone has combined acceptance evidence and an owner; failure and contract-change handling identify what blocks and what can continue.

## 6. Audit and deliver

Walk the graph against the task contracts: check unique stable IDs, resolved prerequisites, acyclicity, justified edges, conflict ownership, feasible dispatch, and acceptance coverage. Trace a fan-out/fan-in and one failed prerequisite if present. Use [examples.md](references/examples.md) when checking those behaviors or adapting a nontrivial plan.

Return Markdown containing:

- Objective, scope, acceptance criteria, plan reference, repository baseline, and assumptions.
- Task contracts and the dependency edge list; add a diagram only when it clarifies the graph.
- Milestones, initial dispatch set, concurrency constraints, and bottleneck analysis.
- Delivery mapping, independent review/integration gates, and recovery rules.
- An audit result distinguishing checks actually performed on the plan from future execution checks.

Save at the user/repository-specified location; otherwise return the plan directly. Replace template placeholders with discovered values or explicit unresolved conditions. Keep unexecuted tasks unchecked and execution evidence marked pending. If blockers remain, label the plan provisional and name their resolution conditions.

**Done:** the plan passes the audit or clearly reports its blockers; planned tests, reviews, and approvals are never presented as completed execution.
