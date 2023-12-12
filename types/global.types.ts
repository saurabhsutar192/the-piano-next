import { NoteMessageEvent } from "webmidi";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
export interface INote {
  note: string;
  velocity: number;
}

export interface NoteEvent extends NoteMessageEvent {
  rawVelocity?: number;
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
