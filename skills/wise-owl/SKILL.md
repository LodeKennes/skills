---
name: wise-owl
description: Owl consultation, where a stronger model diagnoses a stuck technical problem. Use when the user says "owl", or when two fixes have failed on the same problem.
---

The **owl** is `claude-fable-5-2` at `high` effort, a read-only diagnostician. It reads and reasons; you run and edit. Each round reaches a fresh owl, so the **ledger** carries everything it knows.

If you already run as the owl's model, consult it only when the user says "owl".

## 1. Name the goal

State the goal as one check: a command that is **red** now and **green** when the problem is solved. Run it and keep the output verbatim.

Done when you hold the command and its red output. If no command expresses the goal, write the observable you would look for; the owl sharpens it first.

## 2. Write the brief

Tell the user in one line that you are consulting the owl, and why. Then write the brief to a file outside the repo, in exactly these parts:

```
Read <absolute path of this skill's folder>/OWL.md first and follow it.

Round: <n> of 5

## Goal
<the check command, and what green looks like>

## Symptom
<verbatim output of the red check>

## Ledger
<round 1: one entry per fix already tried, as the hypothesis behind it, what you did, the raw result>
<later rounds: the owl's last ledger, unchanged>

## Evidence
<later rounds: each owl question, answered with raw output or file:line>

## Bounds
<repo path; what is out of scope; what you cannot do or reach>
```

You seed every ledger entry as `open`, your own theory of the cause included. Only the owl changes a status.

Done when every part is filled with raw material: output pasted, code cited by `file:line`.

## 3. Dispatch

- **T3 Code** (`delegate_task` is available): a fresh `delegate_task` each round, with model `claude-fable-5-2`, option `effort: high`, `role: "review"`, and the brief as `task`.
- **Elsewhere**, from the repo root:

```bash
claude -p --model claude-fable-5-2 --effort high \
  --tools "Read,Grep,Glob,Bash" \
  --allowedTools "Read,Grep,Glob,Bash(git log:*),Bash(git diff:*),Bash(git blame:*),Bash(git show:*)" \
  --permission-prompts none --strict-mcp-config < <brief file>
```

If neither route reaches `claude-fable-5-2`, report that to the user and stop: another model is not the owl.

Done when the owl's reply is saved beside the brief.

## 4. Act on the reply

The reply is the updated ledger plus one turn:

- **Questions**: answer every one with raw evidence, doing only what the questions ask. Then write the next round's brief (step 2).
- **Verdict**: evidence you already hold against it goes back as the next round's evidence. Otherwise implement the fix and run the check. Green: step 5. Red: the red output is the next round's evidence.
- **Blocked**: step 5.

Round 5 is the last.

## 5. Report

- **Green**: the diagnosis in a sentence or two, the rounds used, and the green output.
- **Round 5 spent, or the owl blocked**: the problem is unsolved. Hand the user the ledger (ruled out, still open, the owl's best remaining hypothesis) and stop work on it. Another consultation on this problem is the user's call.
