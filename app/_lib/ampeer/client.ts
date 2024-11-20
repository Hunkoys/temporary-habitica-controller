"use client";

import { unpack } from "@/app/_lib/ampeer/packer";
import { Payload } from "@/app/_lib/ampeer/types";

export async function listen<T extends Payload>(
  response: Response,
  callback: (payload: T) => void
): Promise<string | null> {
  const id = response.headers.get("peerId");
  if (id == null) return null;

  if (response.body == null) return null;

  const reader = response.body.getReader();

  await reader.read(); // Initialization

  async function startListening() {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const payload = unpack(value);
      callback(payload as T);
    }
  }

  startListening().catch(() => {});
  return id;
}

// function useAmpeer(endpoint: string, onDone: () => void | Promise<void>) {
//   const [payload, setPayload] = useState<Payload | null>(null);

//   useEffect(() => {
//     async function connect() {
//       const postResponse = await fetch(endpoint, {
//         method: "POST",
//         headers: {}, // keepalive
//       });
// if (postResponse.status !== 200) return;
//       return listen(postResponse, (payload) => {
//         setPayload(payload);
//       });
//     }

//     const connection = connect();

//     return () => {
//       async function disconnect() {
//         const id = await connection;
//         if (id == null) return;
//         const deleteResponse = await fetch(endpoint, {
//           method: "DELETE",
//         });
//       }

//       disconnect();
//     };
//   });
// }
