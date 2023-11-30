import { Server } from "socket.io";

import { NextApiRequest, NextApiResponse } from "next";
import { Socket, Server as NetServer } from "net";

type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: Server;
    };
  };
};

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log(
      "--------------------------------------------------------------------------"
    );
    console.log("*First use, starting Socket.IO");
    //@ts-ignore
    const io = new Server(res.socket.server, { path: "/api/socket" });

    io.on("connection", (socket) => {
      console.log(`Socket ${socket.id} connected.`);

      socket.on("message", (message) => {
        io.emit("message", message);
      });

      socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} disconnected.`);
      });
    });
    res.socket.server.io = io;
    console.log(
      "--------------------------------------------------------------------------"
    );
  }
  res.end();
}
