---
name: website-ux
description: "Website UX specialist for designing, auditing, and improving public-facing websites around visitor intent, comprehension, information architecture, navigation, findability, trust, conversion, forms, content hierarchy, mobile usability, accessibility, and perceived performance. Use when building or reviewing homepages, marketing sites, landing pages, pricing pages, signup/contact flows, ecommerce pages, documentation sites, or other websites where users must quickly understand where they are, find what they need, and complete a goal. Prefer this skill over visual-design skills when the question is whether the website works well for users rather than how it looks."
---

# Website UX

Protect **user momentum**: at every moment, the visitor should understand where they are, what matters, what they can do next, and what will happen if they do it.

## Scope and routing

| Skill | Responsibility |
| --- | --- |
| `website-ux` | Usability, information architecture (IA), visitor journeys, comprehension, trust, conversion, friction |
| `ui-ux-pro-max` | UI patterns, visual UX, responsive behavior, typography, color, motion |
| `design-system` | Design tokens and component/system specifications |
| `ui-styling` | Visual implementation and styling |

Make the UX structure sound before prescribing visual styling. Use complementary skills when available and needed for implementation; this workflow does not depend on them. Readability, focus visibility, and contrast belong here when they affect usability, without turning the review into an aesthetic redesign.

## Workflow

Run stages 1–13 in order within the requested scope. For a new design, specify the intended behavior; for an audit/review, inspect existing behavior; for improvements, implement authorized changes and recheck affected journeys. Record each stage's result, or a reason it is not applicable or cannot be verified. Use the relevant website branch below to weight decisions. Finish with the completion gate.

### 1. Establish the user contract

Identify the primary visitor, visitor goal, site/business goal, primary completion/conversion event, likely entry points, visitor knowledge, required information, objections/anxieties, and relevant device context.

Write one governing statement:

> For [visitor] who wants [goal], this page/site should help them [successful outcome] with minimal uncertainty and friction.

Choose one primary visitor/outcome to judge decisions against; record secondary audiences without letting them flatten priorities. Distinguish a visitor's successful outcome from the business conversion event when they differ. Ask only for missing context that changes the decision; otherwise label assumptions.

**Done when:** the contract and observable completion event are explicit.

### 2. Identify critical journeys

Map the routes that matter to the contract. Examples:

- arrive → understand offer → inspect proof → contact
- arrive → identify product → compare → purchase
- pricing → select plan → signup
- search entry → answer question → discover related content
- homepage → find service → understand eligibility → book

For each journey, record the entry condition, user question, next action, information needed, likely hesitation, success state, and recovery path. Include direct entry to an interior page, not only homepage entry.

**Done when:** each critical journey has those seven attributes and a testable success state.

### 3. Run the five-second comprehension test

Evaluate whether an unfamiliar visitor can quickly answer:

1. What is this?
2. Is it relevant to me?
3. Why should I care?
4. What can I do here?
5. Why should I trust this enough to continue?

Favor concrete propositions over slogans. Inspect the initial viewport in its entry context. An agent's heuristic assessment is not an actual five-second test with unfamiliar visitors; label it accordingly.

**Done when:** each answer is supported by visible content or recorded as a gap needing correction or research.

### 4. Audit information architecture

Evaluate navigation labels, information scent (whether a label predicts its destination), grouping, taxonomy, orientation, deep-link entry, and breadcrumbs/local navigation where appropriate. Prefer user vocabulary over internal company terminology. Check that visitors can locate their current position and a useful next destination.

**Optimize for decision clarity, not minimum click count.** Three obvious clicks can be better than one ambiguous choice.

**Done when:** critical destinations have understandable routes from relevant entry points, with ambiguous labels or groupings identified.

### 5. Check content hierarchy and scannability

Assume visitors scan before reading. Check descriptive headings, front-loaded meaning, one dominant idea per section, short paragraphs, meaningful link text, clear grouping, visible key facts, and progressive disclosure. Use lists, tables, diagrams, or summaries when they make the decision easier; keep essential information available before commitment.

Apply the **squint test**: if body text became unreadable, would headings, layout, actions, and major evidence still communicate the page structure?

**Done when:** the scan path communicates the proposition, key facts, supporting evidence, and next action in a useful order.

### 6. Establish action hierarchy

Identify the primary action, useful secondary actions, and utility actions for each decision point. Make competing actions distinguishable by purpose and consequence.

CTA labels should predict outcomes. Prefer “See pricing,” “Start free trial,” “Book a demo,” “Compare plans,” and “Download report” over “Continue,” “Learn more,” “Submit,” or “Get started” when the latter hide what happens next. Context can make a generic label adequate; judge predictability, not vocabulary alone.

**Done when:** the intended next action is obvious and its label matches the destination or resulting state.

### 7. Audit friction

Classify meaningful friction and explain its cause:

| Type | Inspect for |
| --- | --- |
| Interaction | Repeated input, awkward controls, unnecessary manipulation |
| Decision | Indistinguishable choices, unclear tradeoffs |
| Cognitive | Jargon, memory burden, dense or contradictory instructions |
| Uncertainty | Unknown next steps, timing, requirements, or consequences |
| Trust | Missing evidence or unexplained risk |
| Technical | Errors, slow responses, broken behavior |
| Commitment | Premature accounts, payment, consent, or excessive disclosure |

Every meaningful piece of friction should have a reason to exist. Retain useful safeguards and steps that improve understanding or prevent costly mistakes. Do not blindly optimize for fewer steps.

**Done when:** each material friction point has a removal/reduction recommendation or a justified purpose.

### 8. Resolve trust gaps

Evaluate uncertainty about company legitimacy, product efficacy, fit, pricing, data/security, cancellation, delivery, returns, accountability, and support/contactability.

Match uncertainty to relevant evidence: customer outcomes, customer logos, attributed testimonials, case studies, screenshots/demos, pricing transparency, contact/company information, security/privacy explanations, policies, certifications, or independent reviews. Use verifiable evidence; never invent proof or imply unsupported guarantees.

Trust evidence should appear near the uncertainty it resolves, especially before commitment.

**Done when:** key anxieties have relevant evidence at the decision point, or an explicit evidence gap.

### 9. Inspect forms and transactions

Check whether every field is needed now, autofill, appropriate input types, visible labels, optional-field clarity, preserved entered values, inline errors, error association, and recoverability. Show progress for real multi-step flows. Provide loading states and prevent duplicate submissions while allowing recovery after failure.

Make final consequences explicit before submission: what is sent, purchased, charged, agreed to, or scheduled, and what happens next. Verify the success state against the user contract.

**Done when:** the visitor can understand, complete, correct, and confirm the flow without unnecessary re-entry or surprise commitment.

### 10. Inspect feedback and recovery

Check immediate acknowledgement, loading/progress, success confirmation, failure states, and actionable recovery. Consider these states wherever applicable:

- Empty results and zero search results.
- Offline/network failure and unavailable content.
- Permission errors, invalid input, and expired sessions.
- Failed payments/submissions.
- Retry, cancel, and back navigation.

Explain what happened, preserve useful context, and offer a next step that can actually work. Avoid retry paths that risk duplicate transactions or success messages unsupported by the result.

**Done when:** common failures have an understandable message and a working recovery path; unreachable states are marked unverified.

### 11. Review mobile UX

Treat mobile as a different constraint environment, not a scaled desktop. Check content priority, navigation, text readability, touch targets, thumb reach, mobile form keyboard behavior, sticky UI viewport consumption, overflow, overlays/modals, reordered content, tables/comparison layouts, image crop, long headings, zoom/text enlargement, and mobile performance.

**Done when:** the primary journey remains usable at a narrow viewport, including form entry and overlays; distinguish viewport emulation from actual device testing.

### 12. Check accessibility blockers

Inspect semantic structure, heading hierarchy, keyboard operation, visible focus, labels, error association, accessible names, alt text, contrast, status not relying only on color, zoom/reflow, reduced motion, dialog focus management, and touch target usability.

Use relevant inspection tools and manual interaction; automated checks alone cannot establish accessibility. Formal compliance work can defer to a dedicated accessibility skill if one exists. Do not represent this blocker review as compliance certification.

**Done when:** obvious blockers on the reviewed journeys are resolved or reported with affected users and verification steps.

### 13. Assess performance as UX

Evaluate main content appearing quickly, response after clicks, layout stability, stable loading states, reserved image geometry, navigation feedback, and client transitions that do not appear inert. Observe the interaction under relevant device/network constraints when tooling permits.

Core Web Vitals can be supporting evidence, not the entire UX assessment. Tie technical measurements to the moment the visitor waits, loses position, repeats an action, or doubts whether anything happened.

**Done when:** responsiveness and stability are checked through the primary journey, with observed delays or missing measurements recorded.

## Website-specific priorities

Apply the relevant branch alongside the workflow; a hybrid site may need different priorities by journey.

| Website type | Priorities |
| --- | --- |
| Marketing / SaaS | Comprehension, differentiation, proof, objections, pricing/commitment clarity, conversion path |
| Landing pages | Acquisition promise → page proposition → evidence → objection handling → action; check continuity with the actual acquisition message when available |
| Ecommerce | Product findability, category/navigation clarity, search, comparison, product information, delivery/returns, cart, checkout |
| Content / documentation | Information scent, search, taxonomy, page titles, scanning, orientation, related content, version/currentness, deep links |
| Lead generation / services | Service comprehension, audience fit, proof/expertise, process expectations, qualification, contact/booking friction, response expectations |

## Browser-based review

If browser tooling is available, inspect the real experience as evidence for the stages above. At minimum review:

1. Initial viewport at a relevant entry point.
2. Navigation and destination clarity.
3. One primary journey through its success state.
4. One form/conversion flow when present.
5. One reachable error or empty state.
6. A narrow/mobile viewport.
7. Keyboard focus and operation.
8. Loading behavior and layout instability.
9. Runtime failures affecting UX, including relevant console or network failures.

Use safe test data and a test environment for consequential transactions; a review alone does not authorize purchases or sending real enquiries. Mark steps unavailable when access, tooling, or authorized test conditions prevent completion. If no browser is available, use supplied artifacts or code and state the limits of that evidence.

A passing build is not evidence of good UX. Screenshots are evidence, not the audit itself. Record the route, viewport, state, and reproduction steps so another person can verify a finding.

## Evidence and research discipline

Distinguish **observed evidence**, **established usability principle**, and **assumption that requires user research**. Name the principle behind a recommendation, and tie it to the user contract. Do not turn a plausible hesitation into a claim about actual visitors or fabricate analytics, test participants, or conversion lifts.

When available, use funnel completion, abandonment, site search, zero-result search, form errors, field abandonment, rage/dead clicks, backtracking, support requests, session replay, usability tests, interviews, and device/source segmentation. Choose evidence that helps resolve the specific uncertainty.

**Analytics tell you what happened more reliably than why.** Use usability tests or interviews to investigate motivation and comprehension; treat an agent walkthrough as a hypothesis source, not user research.

## Audit output

Begin with the user contract, scope, journeys reviewed, and evidence limitations. Each finding must contain:

```text
Finding: Specific obstacle and its location/state.
User impact: Who is affected and how their goal is impeded.
Evidence: Observation and reproduction details; separate principle and assumption.
Severity: P0/P1/P2/P3, with an impact-based reason.
Recommendation: Concrete change that addresses the cause.
Verification: Repeatable check or research task with an observable success criterion.
```

| Severity | Meaning |
| --- | --- |
| P0 — Blocker | Prevents a critical journey for affected visitors, with no viable recovery, or causes serious harm |
| P1 — High | Substantially impedes an important journey or creates major uncertainty/risk |
| P2 — Medium | Causes meaningful confusion, delay, or avoidable effort with a workable path remaining |
| P3 — Low | Localized usability issue with limited effect on task completion |

Base severity on user impact, not visual ugliness. Prioritize roughly by **user impact × frequency × journey importance × evidence confidence**. This is a reasoning aid, not a mathematically precise score. State unknown frequency/confidence; investigate plausible blockers promptly rather than dismissing them for lack of analytics.

For new designs, deliver the contract, journeys, page/content structure, action hierarchy, and essential states before visual handoff. For implemented improvements, report what changed and which journey checks passed, failed, or remain unknown. An audit can be complete while its recommendations remain unimplemented; say so explicitly.

## Anti-patterns to investigate

Flag these where they harm actual user goals, explaining the mechanism rather than offering subjective design comments:

- Vague proposition, clever navigation labels, organization-centric IA, unexplained jargon.
- Too many equally dominant CTAs, misleading button hierarchy, hidden essential information.
- Premature signup, unnecessary fields, placeholder-only form labels, surprise costs.
- Fake urgency, preselected consent, obstructive banners.
- Navigation dead ends, hover-only information, actions without feedback, destructive actions without recovery.
- Mobile overlays consuming most of the viewport, decorative content preceding essential content, animation delaying task completion.

Do not reject unconventional design merely because it is unconventional. Judge whether it preserves user momentum for the intended visitor.

## Completion gate

Before declaring UX work complete, record pass, fail, or unknown with evidence for each applicable item:

- The intended visitor understands the page.
- The visitor can tell whether it is relevant.
- Information needed for the goal is findable.
- The intended next action is obvious.
- Choices are understandable.
- Unnecessary friction is removed.
- Key anxieties are addressed.
- The journey works on mobile.
- Common failures are recoverable.
- Obvious accessibility blockers are absent.
- Interaction feels responsive and predictable.
- Recommendations are based on user impact rather than taste.

Report unknowns explicitly, including how to resolve them. Separate verified behavior from heuristic judgment and research still needed; do not claim a gate passed merely because a recommendation was written.
