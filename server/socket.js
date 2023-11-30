import { Server } from "socket.io";

const io = new Server(4000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected.`);
  socket.on("send-message", (obj) => {
    io.emit("receive-message", obj);
  });
});
