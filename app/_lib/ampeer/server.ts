"server-only";

import { Payload } from "@/app/_lib/ampeer/types";
import { pack } from "@/app/_lib/ampeer/packer";

type Id = string;
type PeerId = Id;
type ChannelId = Id;
type Dictionary<T> = {
  [id: Id]: T | undefined;
};

class Channel {
  peers: Dictionary<boolean> = {};
}

class Peer {
  channel: ChannelId | null = null;

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
    if (this._connected === false) return false;
    this._controller?.enqueue(pack(payload));
    return true;
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

class AccessManager<T extends Object> {
  private lastPromise: Promise<T>;

  constructor(data: T) {
    this.lastPromise = Promise.resolve(data);
  }

  access<R>(callback: (data: T) => R | Promise<R>): Promise<R> {
    return new Promise((resolve) => {
      this.lastPromise = this.lastPromise.then(async (data) => {
        resolve(await callback(data));
        return data;
      });
    });
  }
}

export class Ampeer {
  private peerManager = new AccessManager<Dictionary<Peer>>({});
  private channelList: Dictionary<Channel> = {};

  async spawn(peerId: PeerId) {
    return await this.peerManager.access((peers) => {
      if (peers[peerId]) return ["peerExists", null] as const;

      const peer = new Peer((reason) => {
        console.log(`lost it: ${reason}`); // delete later
        this.despawn(peerId);
      });

      peers[peerId] = peer;
      peer.send("init");

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

      const sent = peer.send(payload);
      if (sent === false) return "failed to send dm: Peer disconnected";
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

  async broadcast(channelId: ChannelId, payload: Payload) {
    return await this.peerManager.access((peers) => {
      const channel = this.channelList[channelId];
      if (!channel) return "channelDoesNotExist";

      for (const recipientPeerId in channel.peers) {
        const peer = peers[recipientPeerId];
        if (peer) {
          const sent = peer.send(payload);
          if (sent === false)
            console.error(
              `failed to send broadcast to peer ${recipientPeerId}: disconnected`
            );
        }
      }

      return "success";
    });
  }

  async broadcastChannelOf(peerId: PeerId, payload: Payload) {
    return await this.peerManager.access((peers) => {
      const peer = peers[peerId];
      if (!peer) return "peerDoesNotExist";

      const channelId = peer.channel;
      if (!channelId) return "notInChannel";

      return this.broadcast(channelId, payload);
    });
  }

  static headers = {
    Connection: "keep-alive",
    "Content-Encoding": "none",
    "Cache-Control": "no-cache, no-transform",
    "Content-Type": "text/event-stream; charset=utf-8",
  };
}
