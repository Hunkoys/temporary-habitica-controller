"use client";

import ShortcutsSpells from "@/app/shortcuts/_components/Spells";
import { useEffect, useState } from "react";

export default function ShortcutsClientPage(props: { burstCount: string }) {
  const [bro, setBro] = useState<ReadableStreamDefaultReader | null>(null);

  const [n, setN] = useState<number>(0);

  useEffect(() => {
    (async () => {
      // await new Promise((res) => setTimeout(res, 1000));
      const res = await fetch("/api/stream");
      console.log(res.ok);
      const stream = res.body as ReadableStream;
      const reader = stream.getReader();
      console.log("reader: ", reader);
      setBro(reader);
    })();
  }, []);

  useEffect(() => {
    if (bro) {
      const decoder = new TextDecoder();
      (async () => {
        while (true) {
          try {
            const n = await bro.read();
            console.log(n);
            if (n.done) {
              bro.cancel();
              break;
            } else {
              setN(Number(decoder.decode(n.value)));
            }
          } catch (err) {
            console.log("hi");
            break;
          }
        }
      })();
    }

    return () => {
      console.log(`closes: ${bro}`);
      bro?.cancel();
    };
  }, [bro]);

  return (
    <div>
      <div>number: {n}</div>
      <ShortcutsSpells burstCount={props.burstCount} />
    </div>
  );
}
