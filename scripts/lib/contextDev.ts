import ContextDev from "context.dev";

/**
 * Server-side Context.dev client. Scripts load `CONTEXT_DEV_API_KEY` from `.env`.
 * Do not import this module from `src/` — Vite would ship the key to the browser.
 *
 * The SDK retries 408 and 5xx with bounded backoff, and on 429 it waits for
 * `Retry-After` before retrying. Validation errors (400) are not retried.
 */
const MAX_RETRIES = 2;
const REQUEST_TIMEOUT_MS = 90_000;

export class ContextDevConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContextDevConfigError";
  }
}

export interface CorridorSearchHit {
  url: string;
  title: string;
  description: string;
  relevance: "high" | "medium" | "low";
}

export interface CorridorSearch {
  query: string;
  requestId: string;
  creditsConsumed: number | null;
  creditsRemaining: number | null;
  results: CorridorSearchHit[];
}

let client: ContextDev | undefined;

function contextClient(): ContextDev {
  if ("window" in globalThis) {
    throw new ContextDevConfigError("Context.dev runs on the server. Do not import scripts/lib/contextDev.ts from the browser bundle.");
  }
  if (client) {
    return client;
  }
  const apiKey = process.env.CONTEXT_DEV_API_KEY?.trim();
  if (!apiKey) {
    throw new ContextDevConfigError("CONTEXT_DEV_API_KEY is missing. Set it in .env. The SDK reads that variable and the key must stay server-side.");
  }
  client = new ContextDev({
    apiKey,
    maxRetries: MAX_RETRIES,
    timeout: REQUEST_TIMEOUT_MS,
  });
  return client;
}

export async function searchWeb(input: {
  query: string;
  numResults?: number;
  freshness?: "last_24_hours" | "last_week" | "last_month" | "last_year";
}): Promise<CorridorSearch> {
  const query = input.query.trim();
  if (query.length < 1 || query.length > 500) {
    throw new ContextDevConfigError("Search query must be 1–500 characters.");
  }
  const numResults = input.numResults ?? 10;
  if (numResults < 10 || numResults > 100) {
    throw new ContextDevConfigError("numResults must be between 10 and 100.");
  }

  const response = await contextClient().web.search({
    query,
    numResults,
    country: "us",
    tags: ["winter-expedition"],
    ...(input.freshness ? { freshness: input.freshness } : {}),
  });

  return {
    query: response.query,
    requestId: response.request_id,
    creditsConsumed: response.key_metadata?.credits_consumed ?? null,
    creditsRemaining: response.key_metadata?.credits_remaining ?? null,
    results: response.results.map((hit) => ({
      url: hit.url,
      title: hit.title,
      description: hit.description,
      relevance: hit.relevance,
    })),
  };
}
