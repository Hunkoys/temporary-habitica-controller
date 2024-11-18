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
        // console.log("before", before);
        // console.log("after", data);
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

  constructor(private interruptedCallback: (reason?: string) => void) {}

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

  get connected() {
    return this._connected;
  }
}

class Channel {
  peers: List<boolean> = {};
}

class HabiticaNetworkClass {
  private peerManager = new AccessManager<List<Peer>>({});
  private channelList: List<Channel> = {};

  async spawn(peerId: PeerId) {
    return await this.peerManager.access((peers) => {
      if (peers[peerId]) return ["peerExists", null] as const;

      const peer = new Peer((reason) => {
        console.log(`lost it: ${reason}`); // delete later
        this.despawn(peerId);
      });

      peers[peerId] = peer;
      peer.send(`you're alive!`);

      return ["succes", peer.line] as const;
    });
  }

  async despawn(peerId: PeerId) {
    await this.leave(peerId);

    return await this.peerManager.access((peers) => {
      const peer = peers[peerId];
      if (!peer) return "peerDoesNotExist";

      peer.send("goodbye");
      peer.disconnect();
      return "success";
    });
  }

  async dm(peerId: PeerId, payload: Payload) {
    return await this.peerManager.access((peers) => {
      const peer = peers[peerId];
      if (!peer) return "peerDoesNotExist";

      peer.send(payload);
      return "success";
    });
  }

  async join(peerId: PeerId, channelId: ChannelId) {
    return await this.peerManager.access((peers) => {
      const peer = peers[peerId];
      if (!peer) return "peerDoesNotExist";

      peer.channel = channelId;

      const channel =
        this.channelList[channelId] ||
        (this.channelList[channelId] = new Channel());

      channel.peers[peerId] = true;

      // don't await this
      this.broadcast(channelId, { type: "join", peerId });
      return "success";
    });
  }

  async leave(peerId: PeerId) {
    return await this.peerManager.access((peers) => {
      const peer = peers[peerId];
      if (!peer) return "peerDoesNotExist";

      const channelId = peer.channel;
      if (!channelId) return "notInChannel";

      const channel = this.channelList[channelId];
      if (!channel) return "channelDoesNotExist";

      delete channel.peers[peerId];
      peer.channel = null;

      const hasActivePeers = Object.keys(channel.peers).length !== 0;
      if (hasActivePeers) {
        // don't await this
        this.broadcast(channelId, {
          type: "leave",
          peerId,
        });
      } else {
        delete this.channelList[channelId];
      }
      return "success";
    });
  }

  async broadcast(channelId: ChannelId, payload: Payload) {
    return await this.peerManager.access((peers) => {
      const channel = this.channelList[channelId];
      if (!channel) return "channelDoesNotExist";

      for (const peerId in channel.peers) {
        const peer = peers[peerId];
        if (peer) peer.send(payload);
      }

      return "success";
    });
  }
}

// .spawn(peer)
// .despawn(peer)
// .dm(peer, payload)
// .join(peer, channel)
// .leave(peer)
// .broadcast(channel, payload)

const HabiticaNetwork = new HabiticaNetworkClass();

async function POST(id: PeerId) {
  const [status, line] = await HabiticaNetwork.spawn(id);

  if (status === "peerExists") {
    return new Response("User already exists", { status: 400 });
  }

  return new Response(line, { status: 200 });
}

async function DELETE(id: PeerId) {
  await HabiticaNetwork.despawn(id);
}

const me = randomUUID();
const party = "tanglo";

POST(me).then((response) => {
  if (response.status !== 200) return "Failed to spawn";
  if (!response.body) return "No body";

  const reader = response.body.getReader();

  reader.read().then(function next({ done, value }) {
    if (done) {
      console.log("Stream complete");
      return;
    }

    console.log("%cReceived", "color: red;", unpack(value));

    reader.read().then(next);
  });
});

HabiticaNetwork.dm(me, "hoy");

HabiticaNetwork.join(me, party).then(console.error);

HabiticaNetwork.broadcast(party, "hi there newbie").then(console.error);

// HabiticaNetwork.leave(me).then(console.error);

HabiticaNetwork.despawn(me);

HabiticaNetwork.broadcast(party, "checking in").then((res) => {
  console.error("broadcast", res);
});

DELETE(me);

type Payload = string | object;
type UUID4 = string;
type PeerId = UUID4;
type ChannelId = UUID4;
type List<T> = {
  [id: UUID4]: T | undefined;
};
