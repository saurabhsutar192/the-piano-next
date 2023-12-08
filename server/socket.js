import { Server } from "socket.io";

const io = new Server(4000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  socket.on("send-played-notes", (obj, room) => {
    socket.to(room).emit("receive-played-notes", obj);
  });
  socket.on("send-lifted-notes", (obj, room) => {
    socket.to(room).emit("receive-lifted-notes", obj);
  });
  socket.on("request-sustain-toggle", (obj, room) => {
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
});
