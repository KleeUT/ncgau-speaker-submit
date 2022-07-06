import { PostSubmission, Submission } from "../../types";

export const onRequestGet: PagesFunction = () => {
  const data: Submission[] = [
    {
      speakerEmail: "email@email.com",
      speakerName: "speker",
      month: "may",
      title: "the thing",
      id: "fake 1",
    },
  ];
  return new Response(JSON.stringify({ data }));
};

export const onRequestPost: PagesFunction = async ({ request }) => {
  const body: PostSubmission = await request.json();
  return new Response(JSON.stringify({ data: body.data }));
};
