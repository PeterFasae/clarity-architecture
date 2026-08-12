# Clarity — architecture, decisions and evidence

The full implementation is private while it's unfinished. This is a companion repository
of real material pulled from it, for anyone who wants more than the [case
study](https://peterfasae.github.io/clarity.html) — actual code, the actual decisions log,
and the actual test files behind the claims made there.

Everything here is exactly as it exists in the private repository. Nothing has been
rewritten, tidied up, or improved for this audience.

## What Clarity is

A note-taking system built around one question: when is a note allowed to leave the
system? A note can only reach a third-party AI service once a user has explicitly opted
in, and that boundary is proved by a test that watches the network rather than trusting
the code — `services/api/tests/ai.test.js` below is that test, exactly as it runs against
the real API.

Serverless on AWS — Lambda, API Gateway, DynamoDB, Cognito — with a React front end.
121 tests across the full implementation. **Not deployed.**

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

  These two files depend on the rest of the private implementation (the Lambda handlers,
  the DynamoDB Local test rig, a `helpers.js` not included here) to actually execute, so
  `npm test` in this repository does not run them — they're included to be read, not to
  pass or fail here. What you can verify directly is that the test names describe real
  behaviour and the assertions say what this README claims they say.

## What isn't here

Product and business planning — market positioning, the accessibility-conformance
research the build is measured against, unshipped feature copy — stays in the private
repository. This companion is the engineering evidence, not the whole project.

## Status

Nothing is deployed. `serverless package` runs clean and the generated CloudFormation has
been inspected resource by resource, but there's no AWS account behind it yet, so no
number anywhere in this repository describes production behaviour — only what was
measured locally, labelled as a lower bound rather than a result.

## Elsewhere

- [Case study](https://peterfasae.github.io/clarity.html) — the prose version of this
- [Portfolio](https://peterfasae.github.io/) — Peter Fasae
