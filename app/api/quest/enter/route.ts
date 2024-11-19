import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const party = "tanglo";

export type EnterPostRequest = {
  id: string;
  channel: string;
};
export async function POST(req: NextRequest) {
  const id = randomUUID();
  const channel = party;

  if (!id || !channel) {
    return new Response("Missing id or channel", { status: 400 });
  }

  const [spawn, stream] = await HabiticaNetwork.spawn(id);

  if (spawn === "peerExists") {
    return new Response("User already exists", { status: 400 });
  }
  if (spawn !== "succes") {
    return new Response("Failed to spawn", { status: 500 });
  }

  const join = await HabiticaNetwork.join(id, channel);

  if (join !== "success") {
    return new Response("Failed to join channel", { status: 500 });
  }

  HabiticaNetwork.dm(id, {
    type: "init",
    data: { id },
  });

  // do this on header

  return new NextResponse(stream, {
    status: 200,
    headers: {
      Connection: "keep-alive",
      "Content-Encoding": "none",
      "Cache-Control": "no-cache, no-transform",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}

export type DeleteBody = {
  id: string;
};
export async function DELETE(req: NextRequest) {
  const { id }: DeleteBody = await req.json();
  const despawn = await HabiticaNetwork.despawn(id);

  if (despawn !== "success") {
    return new Response("Failed to despawn", { status: 500 });
  }

  return new Response("Despawned", { status: 200 });
}

let hp = 300;

export async function PUT(req: NextRequest) {
  const h = await headers();
  const id = h.get("peer-id");

  if (!id) {
    return new Response("Missing id", { status: 400 });
  }

  const { damage }: { damage: number } = await req.json();

  HabiticaNetwork.broadcast(id, {
    type: "bossDamage",
    data: {
      hp: (hp -= damage).toFixed(2),
    },
  });

  return new Response("Success", { status: 200 });
}

// --- End of file

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

      return ["succes", peer.line] as const;
    });
  }

  async despawn(peerId: PeerId) {
    await this.leave(peerId);

    return await this.peerManager.access((peers) => {
      const peer = peers[peerId];
      if (!peer) return "peerDoesNotExist";

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
      if (hasActivePeers === false) {
        delete this.channelList[channelId];
      }
      return "success";
    });
  }

  async broadcast(peerId: PeerId, payload: Payload) {
    return await this.peerManager.access((peers) => {
      const peer = peers[peerId];
      if (!peer) return "peerDoesNotExist";

      const channelId = peer.channel;
      if (!channelId) return "notInChannel";

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

const HabiticaNetwork = new HabiticaNetworkClass();

type Payload = {
  type: string;
  data: object;
};
type UUID4 = string;
type PeerId = UUID4;
type ChannelId = UUID4;
type List<T> = {
  [id: UUID4]: T | undefined;
};
