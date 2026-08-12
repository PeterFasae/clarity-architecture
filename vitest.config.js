import { defineConfig } from 'vitest/config';

// Only the retrieval engine is a runnable, self-contained package in this
// repository. services/api/tests/ai.test.js is included as a read-only
// excerpt — it exercises the real API, which depends on files (handlers,
// test helpers, the DynamoDB Local rig) that live only in the private
// implementation. Scoping the test run here means `npm test` reports
// honestly on what this repo can actually prove, rather than failing on a
// file it was never going to be able to run.
export default defineConfig({
  test: {
    include: ['packages/**/*.test.js'],
  },
});
