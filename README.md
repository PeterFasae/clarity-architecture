# Clarity — architecture, decisions and evidence

> **November 2026:** the full Clarity implementation is now public at
> [github.com/PeterFasae/clarity](https://github.com/PeterFasae/clarity), and that is the
> repository to read. This companion is a snapshot from August 2026, made while the main
> repository was private, and its figures are from then. The full suite had 121 tests at the
> time; 270 passed on 4 November 2026. Clarity is still not deployed.

When this snapshot was made, the full implementation was private while it was unfinished. This was a companion repository
of real material pulled from it, for anyone who wants more than the [case
study](https://peterfasae.github.io/clarity.html) — actual code, the actual decisions log,
and the actual test files behind the claims made there.

Everything here was copied exactly as it existed in the then-private repository in August
2026. Nothing was rewritten, tidied up, or improved for this audience.

## What Clarity is

A note-taking system built around one question: when is a note allowed to leave the
system? A note can only reach a third-party AI service once a user has explicitly opted
in, and that boundary is proved by a test that watches the network rather than trusting
the code — `services/api/tests/ai.test.js` below is that test, exactly as it runs against
the real API.

Serverless on AWS — Lambda, API Gateway, DynamoDB, Cognito — with a React front end.
121 tests across the full implementation when this snapshot was taken (270 on 4 November
2026). **Not deployed.**

## What's actually runnable here

```bash
npm install
npm test
```

This runs the **retrieval engine's real test suite — 25 tests, genuinely passing, right
now, in this repository.** `packages/retrieval/index.js` is the whole engine: summarise,
extractActions, search. It's dependency-free, does no I/O, and is vendored here unedited,
which is why it's the one piece of Clarity that can be dropped into a fresh checkout and
proven on the spot rather than taken on trust.

## What's here as reference, not as a runnable app

- **`docs/decisions.md`** — the real decisions log kept during the build. Short entries,
  one per non-obvious call, written as it happened rather than after the fact — including
  the bugs found along the way: a CORS test that was quietly measuring the local emulator
  instead of the code, an `aria-live` region that would have read an entire notes list
  aloud on every keystroke, a colour that passed contrast on white and failed everywhere
  it was actually used.
- **`docs/deployment.md`** — the real deployment runbook, including the honest reason
  nothing is deployed: no AWS credentials on this machine. It states plainly which
  performance figures are proven and which are unclaimed.
- **`services/api/serverless.yml`** — the real infrastructure definition. Thirteen Lambda
  functions, each with its own IAM role scoped to exactly what it needs — `deleteNote`
  holds `dynamodb:DeleteItem` and nothing else, ownership enforced by a condition
  expression rather than a prior read. CloudWatch alarms on error *rate* rather than error
  count, because a ratio is the only thing that tells a bad hour from a quiet one.
- **`services/api/tests/ai.test.js`** and **`services/api/tests/setup/anthropic-recorder.js`**
  — the privacy-boundary test and the instrument behind it. `ANTHROPIC_BASE_URL` points the
  SDK at a small HTTP server inside the test rig, so any outbound request — through any
  code path, intended or not — is counted. One test drives every route that could plausibly
  reach the model and asserts the count is zero; the next turns the flag on and asserts the
  count rises, because a zero that could never be anything else proves nothing.

  These two files depend on the rest of the implementation, now public in the main repository (the Lambda handlers,
  the DynamoDB Local test rig, a `helpers.js` not included here) to actually execute, so
  `npm test` in this repository does not run them — they're included to be read, not to
  pass or fail here. What you can verify directly is that the test names describe real
  behaviour and the assertions say what this README claims they say.

## What isn't here

Product and business planning — market positioning, the accessibility-conformance
research the build is measured against, unshipped feature copy — lives in the main
repository, not here. This companion is the engineering evidence, not the whole project.

## Status

Nothing is deployed. `serverless package` runs clean and the generated CloudFormation has
been inspected resource by resource, but there's no AWS account behind it yet, so no
number anywhere in this repository describes production behaviour — only what was
measured locally, labelled as a lower bound rather than a result.

## Elsewhere

- [Case study](https://peterfasae.github.io/clarity.html) — the prose version of this
- [Portfolio](https://peterfasae.github.io/) — Peter Fasae
