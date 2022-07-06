const jsonResponses = async ({ next }) => {
  const response = await next();
  response.headers.set("Content-Type", "application/json");
  return response;
};
const corsOpen = async ({ next }) => {
  const response = await next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Headers", "*");
  return response;
};

const errorHandler = async ({ next }) => {
  try {
    return await next();
  } catch (err) {
    return new Response(
      JSON.stringify({
        err: {
          message: err.message,
          stack: err.stack,
        },
      }),
      { status: 500 }
    );
  }
};

export const onRequest = [jsonResponses, corsOpen, errorHandler];
