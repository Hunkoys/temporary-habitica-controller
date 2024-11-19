import { HabiticaEvent, HabiticaEventMap } from "@/app/_processes/types";

class Peer {
  peerId: string;

  constructor(peerId: string) {
    this.peerId = peerId;
  }

  send<T extends keyof HabiticaEventMap>(action: T, data: HabiticaEvent<T>) {
    console.log(action, data);
  }
}

class Channel {
  channelId: string;

  peers: Peer[] = [];

  constructor(channelId: string) {
    this.channelId = channelId;
  }

  emit<T extends keyof HabiticaEventMap>(action: T, data: HabiticaEvent<T>) {
    let i = 0;
    while (this.peers[i]) {
      this.peers[i].send(action, data);
      console.log(`sending ${this.peers[i].peerId}`);
      i++;
    }
  }

  join(peer: Peer) {
    this.peers.push(peer);
  }

  quit(peerId: string) {
    this.peers = this.peers.filter((peer) => peer.peerId !== peerId);
  }
}

class HabiticaServerProcessClass {
  private channels: {
    [channelId: string]: Channel | undefined;
  } = {};

  channel(channelId: string) {
    if (this.channels[channelId] === undefined) {
      this.channels[channelId] = new Channel(channelId);
    }

    return this.channels[channelId];
  }

  destroyChannel(channelId: string) {}

  // createChannel(channelId: string) {
  //   if (this.channels[channelId]) {
  //     throw new (class ChannelError extends Error {})("Channel already Exists");
  //   }

  //   this.channels[channelId] = new Channel(channelId);

  //   return this.channels[channelId];
  // }

  // getChannel(channelId: string) {
  //   return this.channels[channelId];
  // }
}

const HabiticaServerProcess = new HabiticaServerProcessClass();
// Used class to utilize private field; Defined constant for editor suggestion when importing

export default HabiticaServerProcess;
