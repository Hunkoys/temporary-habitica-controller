import { Payload } from "@/app/_lib/ampeer/types";

const encoder = new TextEncoder();
export function pack(payload: Payload) {
  return encoder.encode(
    typeof payload === "string" ? payload : JSON.stringify(payload)
  );
}
const decoder = new TextDecoder();
export function unpack(data: Uint8Array): Payload {
  try {
    return JSON.parse(decoder.decode(data));
  } catch (err) {
    if (err instanceof SyntaxError) return decoder.decode(data);
    console.error(err);
  }

  return "";
}
