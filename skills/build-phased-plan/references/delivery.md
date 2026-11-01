# Delivery and recovery

Read this when the plan involves concurrent implementation or multiple PRs.

## Execution graph and Git topology

Record a known base revision per branch and prerequisite artifact revisions in each handoff. Use an isolated checkout and branch per concurrent writer, with one accountable owner. Transfer explicit commits or patches; another agent cannot consume an uncommitted conversation.

Independent PRs target the shared integration branch. A dependent PR may target its prerequisite branch when it needs that code to build or be reviewed. For multiple parents, name an integration owner who assembles the prerequisite commits on an integration branch or waits for them to land before creating the consumer branch. State which choice applies and when that branch is validated. Git's branch base alone cannot represent every prerequisite of a join.

Specify a topological merge order for dependent PRs; independent PRs can land in either order subject to combined checks. After the base moves, update the branch, rerun affected validation, and refresh affected review evidence. Follow repository merge policy and preserve shared history.

## Self-contained handoff

Each assignment carries the task contract, baseline, accepted input revisions, applicable guidance, write boundaries, expected artifact location, validation commands, and reporting requirements. Name the integrator and shared resources. The recipient returns the output revision, checks with results, unresolved findings, and any changed assumptions. Capacity governs dispatch; the plan itself grants no deployment or external-write authorization.

## Review and integration

Keep PR descriptions specific: the problem and resulting behavior, affected modules, dependency/base relationships, validation, and material risks. Add a diagram when it explains a non-obvious relationship. Record planned commands as planned until their actual results exist.

The integrator records the exact combined revision and input revisions, resolves conflicts with the task owners, and runs cross-component acceptance checks. Independent review covers the integrated change and evidence at that revision. If a review record is stored in a new commit, distinguish the reviewed code revision from the evidence-only commit that records the verdict.

## Replanning

Record task state as pending, running, accepted, blocked, failed, or superseded alongside the existing checkbox convention. Check a task only when its acceptance and required review gates are satisfied. The integrator owns state updates, reserves declared exclusive resources at dispatch, and releases them after the task completes or stops. Model a resource-intensive stage as its own task when that enables useful overlap with preparation work.

When a prerequisite fails, hold descendants that require its output; other ready branches continue. Add a remediation task with a new ID. If revising the failed task's release condition, return it to pending: it waits for the remediation prerequisite, then reruns its checks and required review before acceptance. If replacing it, mark it superseded and redirect consumers to the replacement task and output. Preserve prior IDs and failed-attempt evidence in either case. Retry external operations only after verifying the observed state and the task's retry/rollback conditions.

When a contract or accepted output changes, record old/new revisions and inspect transitive consumers. Pause affected running assignments while assessing compatibility. Mark affected acceptance/review evidence stale, update their input versions, and reopen completed consumers where necessary. For each consumer retained as accepted, record why its contract and evidence remain valid. Recompute edges, readiness, and bottlenecks before dispatch resumes. Escalate scope-changing decisions to the user while independent authorized work continues.
