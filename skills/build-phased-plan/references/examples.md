# Behavioral examples

These abbreviated fixtures test scheduling decisions. A delivered plan supplies the full task contracts from SKILL.md.

## Diamond with an unrelated slow branch

Acceptance: client and server interoperate against contract v1; the published guide matches that contract.

| ID | Output | Direct prerequisites and release condition | Owner / write scope |
| --- | --- | --- | --- |
| #APIT001 | Contract v1 and compatibility fixtures | None; contract review accepts v1 | Contract owner / schema and fixtures |
| #APIT002 | Server implementing v1 | #APIT001: accepted fixtures and schema | Server owner / server module |
| #APIT003 | Client implementing v1 | #APIT001: accepted fixtures and schema | Client owner / client module |
| #APIT004 | Guide for v1 | #APIT001: accepted schema | Docs owner / guide |
| #APIT005 | Integrated client/server evidence | #APIT002 and #APIT003: checks and independent reviews accepted | Integrator / integration tests |
| #APIT006 | Release acceptance record | #APIT004 and #APIT005: guide and combined checks accepted | Independent release reviewer / review record |

With three executor slots, distinct scopes, and no shared exclusive resource, start #APIT002, #APIT003, and #APIT004 after #APIT001 is accepted. As soon as #APIT002 and #APIT003 are accepted, #APIT005 can start even while #APIT004 runs. Only #APIT006 needs both branches. Slot availability does not imply review capacity: account for reviewer constraints separately.

The client and server branches share the accepted contract base. The integrator assembles their identified commits for #APIT005 and records the combined revision. The release gate consumes actual evidence; its plan entry remains unchecked until execution.

## Conflict without a dependency

Two independent migration tasks each declare a resettable test database as an exclusive resource. They have no artifact dependency. Record `migration-test-db: capacity 1`, an acquisition/release owner, and a tie-break policy. Both tasks are ready, but only one dispatches and reserves the database; the other stays ready and deferred until release. There is no edge between them. To overlap preparation, split each task into preparation and database-validation tasks with the resource demand attached only to validation.

If #APIT002 and #APIT003 in the diamond both reserve that database, dispatch #APIT002 and #APIT004 after contract acceptance; defer #APIT003 even with a free executor slot. After #APIT002 releases the database, dispatch #APIT003. Their join can still run while docs continues.

Two tasks editing the same generator output need one output owner or an explicit reconciliation task; separate worktrees alone are insufficient. Parallel edits to disjoint consumers still require compatibility checks against their shared contract.

## Failure and contract change

If #APIT002 fails, #APIT005 and #APIT006 remain blocked. #APIT003 and #APIT004 may finish against accepted v1. Add #APIT007 to remediate the server, make #APIT002's acceptance require its verified result, and return #APIT002 from failed to pending. After #APIT007 is accepted, rerun #APIT002's affected checks and review before accepting it. This adds #APIT007 -> #APIT002 without renumbering existing tasks; #APIT007 consumes the failed revision as an artifact, rather than depending on accepted #APIT002. Alternatively, mark #APIT002 superseded and redirect its consumers to the accepted replacement, preserving the failed-attempt record.

If remediation instead changes v1 to v2, assess #APIT003, #APIT004, #APIT005, and #APIT006. Reopen affected consumers, supersede stale evidence, and record any compatibility argument that lets an output remain accepted. Consumers resume only after the replacement contract's release condition is met.

## Audit probes

1. Add an unknown prerequisite: the plan becomes provisional until its producer or external resolution condition is defined.
2. Add #APIT005 -> #APIT001: the cycle is reported and the affected component cannot dispatch until restructured.
3. Move #APIT003 to another milestone: its ID and prerequisites remain unchanged.
4. Reduce executor capacity to one: readiness remains graph-based, while dispatch becomes serial.
5. Plan one isolated documentation correction: one contract with its check and review gate suffices; no stack, graph diagram, or synthetic review commit is required.
