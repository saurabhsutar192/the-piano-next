/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types/global.types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (res.socket.server.io) {
    console.log("Server Already Exists!");
    res.end();
  }
  const path = "/api/socket/io";
  const httpServer: NetServer = res.socket.server as any;
  const io = new ServerIO(httpServer, {
    path,
    // @ts-ignore
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log(`Socket ${socket.id} connected.`);

    let broadcastRoom = "";

    socket.on("send-played-notes", (obj, room) => {
      socket.to(room).emit("receive-played-notes", obj);
    });
    socket.on("send-lifted-notes", (obj, room) => {
      socket.to(room).emit("receive-lifted-notes", obj);
    });
    socket.on("request-sustain-toggle", (room) => {
      socket.to(room).emit("ask-sustain-toggle");
    });
    socket.on("send-sustain-toggle", (obj, room) => {
      socket.to(room).emit("receive-sustain-toggle", obj);
    });

    socket.on("join-room", ({ room, isBroadcaster }, callback) => {
      const rooms = io.sockets.adapter.rooms;

      if (isBroadcaster) {
        if (rooms.has(room)) {
          callback(room, `This Broadcaster already exists!`);
        } else {
          socket.join(room);
          broadcastRoom = room;
          callback(room);
        }
      } else {
        if (rooms.has(room)) {
          socket.join(room);
          callback(room);
        } else {
          callback(room, `Broadcaster doesn't exist!`);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("disconnected ", socket.id);
      if (`p-${socket.id}` === broadcastRoom) {
        socket.to(broadcastRoom).emit("receive-disconnect-broadcast");
      }
    });
  });

  res.end();
};

export default ioHandler;
