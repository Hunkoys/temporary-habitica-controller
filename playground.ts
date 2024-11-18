import { randomUUID } from "crypto";

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// --- Strict ---

// type Stack = number[][];
// type LastPromise = Promise<Stack>;
// let lastPromise: LastPromise = Promise.resolve([[]]);

// async function getStack(
//   cb: (stack: Stack) => Stack | LastPromise | Promise<void> | void
// ) {
//   lastPromise = lastPromise.then(async (stack) => {
//     const r = await cb([...stack]);
//     return r ? [...r] : stack;
//   });

//   await lastPromise;
// }

// async function main() {
//   getStack(async (stack) => {
//     await sleep(1000);
//     stack[0].push(3);
//     console.log(stack);
//     setTimeout(() => {
//       stack[0].push(4);
//     }, 40);
//     return stack;
//   });

//   getStack((stack) => {
//     stack.push([2]);
//     console.log(stack);

//     // return stack;
//   });

//   await getStack(async (stack) => {
//     await sleep(500);
//     stack.push([3]);
//     console.log(stack);

//     return stack;
//   });

//   console.log("done here");
// }

// main();

// getStack((stack) => {
//   stack.push([4]);
//   console.log(`stack ${stack}`);

//   return stack;
// });

// getStack(console.log);

// getStack((stack) => {
//   setTimeout(() => {
//     console.log(stack);
//   }, 1600);
// });

// --- Strict ---

// --- Loose ---

// type Stack = number[];
// type LastPromise = Promise<Stack>;
// let lastPromise: LastPromise = Promise.resolve([]);

// async function getStack(cb: (stack: Stack) => Promise<void> | void) {
//   lastPromise = lastPromise.then(async (stack) => {
//     await cb(stack);
//     return stack;
//   });

//   await lastPromise;
// }

// async function main() {
//   getStack(async (stack) => {
//     await sleep(1000);
//     stack.push(1);
//     console.log(stack);
//   });

//   getStack((stack) => {
//     stack.push(2);
//     console.log(stack);
//   });

//   await getStack(async (stack) => {
//     await sleep(500);

//     // await getStack(() => {}); // This will get stuck
//     stack.push(3);
//     console.log(stack);
//   });

//   console.log("done here");
// }

// main();

// getStack((stack) => {
//   stack.push(4);
//   console.log(`stack ${stack}`);
// });

// getStack(console.log);

// console.log("thread");

// --- Loose ---

function deepCopy(obj: Object) {
  return { ...obj };
}

class AccessManager<T extends Object> {
  private lastPromise: Promise<T>;

  constructor(data: T) {
    this.lastPromise = Promise.resolve(data);
  }

  access<R>(callback: (data: T) => R | Promise<R>): Promise<R> {
    return new Promise((resolve) => {
      this.lastPromise = this.lastPromise.then(async (data) => {
        const before = deepCopy(data);
        resolve(await callback(data));
        console.log("before", before);
        console.log("after", data);
        return data;
      });
    });
  }
}

const encoder = new TextEncoder();
function pack(payload: Payload) {
  return encoder.encode(
    typeof payload === "string" ? payload : JSON.stringify(payload)
  );
}
const decoder = new TextDecoder();
function unpack(data: Uint8Array) {
  try {
    return JSON.parse(decoder.decode(data));
  } catch (err) {
    if (err instanceof SyntaxError) return decoder.decode(data);
    console.error(err);
  }
}

class Peer {
  channel: string | null = null;

  private _controller: ReadableStreamDefaultController | null = null;
  private _connected: boolean = true;
  private interruptedCallback: (reason?: string) => void = () => {};

  line = new ReadableStream({
    start: (controller) => {
      this._controller = controller;
    },

    cancel: (reason) => {
      this._connected = false;
      this.interruptedCallback(reason);
    },
  });

  send(payload: Payload) {
    if (this._connected) this._controller?.enqueue(pack(payload));
  }

  disconnect() {
    if (this._connected) {
      this._controller?.close();
      this._connected = false;
    }
  }

  onInterrupted(callback: typeof this.interruptedCallback) {
    this.interruptedCallback = callback;
  }

  get connected() {
    return this._connected;
  }
}

class Channel {
  peers: PeerId[] = [];
}

class HabiticaNetworkClass {
  private peerList = new AccessManager<List<Peer>>({});
  private channelList = new AccessManager<List<Channel>>({});

  async spawn(peerId: PeerId) {
    return await this.peerList.access((peers) => {
      const peer = new Peer();
      peers[peerId] = peer;

      peer.onInterrupted((reason) => {
        console.log(`lost it: ${reason}`);
        this.despawn(peerId);
      });

      peer.send(`you're alive!`);

      return peer.line;
    });
  }

  async despawn(peerId: PeerId) {
    await this.peerList.access((peers) => {
      const peer = peers[peerId];

      peer.send("goodbye");
      peer.disconnect();

      delete peers[peerId];
    });
  }
}

// .spawn(peer)
// .despawn(peer)
// .dm(peer, payload)
// .join(peer, channel)
// .leave(peer)

// .start(channel)
// .terminate(channel)
// .broadcast(channel, payload)

const HabiticaNetwork = new HabiticaNetworkClass();

async function POST(id: PeerId) {
  const line = await HabiticaNetwork.spawn(id);

  return line;
}

async function DELETE(id: PeerId) {
  await HabiticaNetwork.despawn(id);
}

const me = randomUUID();
const party = "tanglo";

POST(me).then((line) => {
  const reader = line.getReader();
  reader.read().then(function next({ done, value }) {
    if (done) {
      console.log("Stream complete");
      return;
    }

    console.log("Received", unpack(value));

    reader.read().then(next);
  });
});

DELETE(me);

type Payload = string | object;
type ID = string;
type PeerId = ID;
type ChannelId = ID;
type List<T> = {
  [id: ID]: T;
};
