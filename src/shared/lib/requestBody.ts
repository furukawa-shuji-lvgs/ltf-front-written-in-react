const textEncoder = new TextEncoder();

export class RequestBodyTooLargeError extends Error {
  constructor(limitBytes: number) {
    super(`Request body is larger than ${limitBytes} bytes.`);
    this.name = "RequestBodyTooLargeError";
  }
}

const byteLength = (value: string): number => textEncoder.encode(value).byteLength;

export const readLimitedRequestText = async (
  request: Request,
  limitBytes: number,
): Promise<string> => {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > limitBytes) {
    throw new RequestBodyTooLargeError(limitBytes);
  }

  const text = await request.text();
  if (byteLength(text) > limitBytes) {
    throw new RequestBodyTooLargeError(limitBytes);
  }

  return text;
};

export const readLimitedRequestJson = async (
  request: Request,
  limitBytes: number,
): Promise<unknown> => {
  const text = await readLimitedRequestText(request, limitBytes);
  if (text.length === 0) {
    return null;
  }

  return JSON.parse(text);
};
