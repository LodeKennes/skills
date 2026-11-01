# Graph patterns

Use these patterns when work crosses contracts or when a graph appears more serial than the underlying problem.

## Minimal edges

For each edge ask: which accepted output does the consumer need, and what would break if it started earlier? If the answer is only presentation order, remove the edge. If the answer is access to a shared resource, describe the resource constraint instead. Keep a direct edge for an independently meaningful release condition even if another path already orders the tasks.

Dependencies include data, interfaces, decisions, and required approvals. Contract acceptance may release consumers before the producer's entire feature is complete: split that accepted contract into its own task. A mock is a useful input only when its owner, version, fidelity limits, and later compatibility check are explicit.

## Diamond and joins

`contract -> backend`, `contract -> client`, `backend -> integration`, `client -> integration` permits backend and client work concurrently. Integration consumes identified versions of both outputs and checks their interaction. Add documentation to that join only if documentation is part of its acceptance contract.

At every join, inspect pairwise compatibility as well as individual acceptance. Green branch checks cannot establish that combined schemas, migrations, defaults, or generated outputs agree. Assign shared generated output to one owner; coordinate generator inputs from other tasks through contracts.

## Cycles and uncertainty

For `A -> B -> A`, identify the smallest jointly required interface. Extract it, merge the inseparable tasks, or schedule a bounded experiment that resolves the uncertainty. Record the experiment's decision evidence and which downstream tasks must be replanned. An unresolved cycle blocks dispatch of that component; unrelated acyclic components may remain executable in a clearly provisional plan.

## Critical path and contention

For a DAG with usable duration estimates, compute earliest finish as task duration plus the maximum earliest finish of its prerequisites. The greatest finish time is a dependency-only lower bound; trace maximizing predecessors to identify critical paths. Include review and integration latency when estimated. Report ranges rather than invented precision.

Limited executors, exclusive environments, and scarce reviewers can lengthen delivery beyond that bound. Use bounded list scheduling of ready tasks instead of optimizing for maximum graph width. Splitting tiny tasks can cost more in handoff/review overhead than concurrency saves. Revisit the bottleneck after estimates or constraints change.

## Foundations

These are adaptations to implementation planning, rather than guarantees of a particular scheduler:

- [Bazel dependencies](https://bazel.build/concepts/dependencies): declared dependencies must cover actual prerequisites; excess edges obscure parallelism.
- [Dask scheduling](https://docs.dask.org/en/stable/scheduling-policy.html): select runnable tasks as predecessors complete rather than imposing whole-graph rounds.
- [Dask worker resources](https://distributed.dask.org/en/stable/resources.html): eligibility also depends on resource demands and capacity.
- [Build systems à la carte](https://ndmitchell.com/downloads/paper-build_systems_a_la_carte_theory_and_practice-21_apr_2020.pdf): scheduling and deciding which outputs remain valid are separate concerns; a changed input requires an explicit evidence invalidation decision.
