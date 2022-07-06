import { parseJwt } from "@cfworker/jwt";
import { PostSubmission, Submission } from "../../types";

export const onRequestGet: PagesFunction<{
  SPEAKER_SUBMIT_STORE: KVNamespace;
}> = async ({ env, request }) => {
  const tokenHeader = request.headers.get("Authorization");

  if (!tokenHeader) {
    return new Response("Nope", { status: 403 });
  }

  const token = tokenHeader.substring(tokenHeader.indexOf("ey"));

  const parsedToken = await parseJwt(
    token,
    "https://speaker-submit.au.auth0.com/",
    "speaker-submit"
  );

  if (!parsedToken.valid) {
    return new Response("Nope", { status: 403 });
  }

  const keys = await env.SPEAKER_SUBMIT_STORE.list();
  const itemsPromise = keys.keys.map(async (key) => {
    const item = await env.SPEAKER_SUBMIT_STORE.get(key.name);
    return JSON.parse(item);
  });

  const data: Submission[] = await Promise.all(itemsPromise);
  return new Response(JSON.stringify({ data }));
};

export const onRequestPost: PagesFunction<{
  SPEAKER_SUBMIT_STORE: KVNamespace;
}> = async ({ request, env }) => {
  const body: PostSubmission = await request.json();
  const id = crypto.randomUUID();
  await env.SPEAKER_SUBMIT_STORE.put(id, JSON.stringify({ ...body.data, id }));
  return new Response(JSON.stringify({ data: body.data }));
};

// We need this for preflight checks
// Thanks stack overflow
export const onRequestOptions: PagesFunction = async ({ request }) => {
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  let headers = request.headers;
  if (
    headers.get("Origin") !== null &&
    headers.get("Access-Control-Request-Method") !== null &&
    headers.get("Access-Control-Request-Headers") !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    let respHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
      // Allow all future content Request headers to go back to browser
      // such as Authorization (Bearer) or X-Client-Name-Version
      "Access-Control-Allow-Headers":
        request.headers.get("Access-Control-Request-Headers") || "*",
    };

    return new Response(null, {
      headers: respHeaders,
    });
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS",
      },
    });
  }
};
