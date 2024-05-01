const isPlainObject = (value: unknown) => value?.constructor === Object;

export class ResponseError extends Error {
  response: Response;

  constructor(message: string, res: Response) {
    super(message);
    this.response = res;
  }
}

export default async function myFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  let initOptions = init;
  if (initOptions?.body) {
    if (Array.isArray(initOptions.body) || isPlainObject(initOptions.body)) {
      initOptions = {
        ...initOptions,
        body: JSON.stringify(initOptions.body),
        headers: {
          "Content-Type": "application/json",
          ...initOptions.headers,
        },
      };
    }
  }

  const res = await fetch(input, initOptions);
  if (!res.ok) {
    throw new ResponseError("Response failed", res);
  }

  return res;
}
