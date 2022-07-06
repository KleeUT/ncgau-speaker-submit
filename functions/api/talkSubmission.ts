import { PostSubmission, Submission } from "../../types";

export const onRequestGet: PagesFunction<{
  SPEAKER_SUBMIT_STORE: KVNamespace;
}> = async ({ env }) => {
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
  await env.SPEAKER_SUBMIT_STORE.put(id, JSON.stringify({ ...body, id }));
  return new Response(JSON.stringify({ data: body.data }));
};
