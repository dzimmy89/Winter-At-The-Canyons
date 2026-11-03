import "dotenv/config";
import { searchWeb } from "./lib/contextDev.ts";
import { writeGenerated } from "./lib/io.ts";

const query =
  "official winter road conditions and traction laws driving from Gainesville Florida to Park City Utah via I-10 US-93 I-15 and Provo Canyon US-189";

const outcome = await searchWeb({ query, numResults: 10 });

if (outcome.results.length === 0) {
  console.error(
    JSON.stringify(
      {
        requestId: outcome.requestId,
        creditsConsumed: outcome.creditsConsumed,
        resultCount: 0,
        query: outcome.query,
      },
      null,
      2,
    ),
  );
  throw new Error("Context.dev search returned no corridor sources.");
}

writeGenerated("corridor-brief.json", {
  retrievedAt: new Date().toISOString(),
  query: outcome.query,
  requestId: outcome.requestId,
  results: outcome.results,
});

console.log(
  JSON.stringify(
    {
      requestId: outcome.requestId,
      creditsConsumed: outcome.creditsConsumed,
      creditsRemaining: outcome.creditsRemaining,
      resultCount: outcome.results.length,
      query: outcome.query,
      results: outcome.results,
    },
    null,
    2,
  ),
);
