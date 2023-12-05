import { Server } from "socket.io";

const io = new Server(4000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(`Socket ${socket.id} connected.`);
  socket.on("send-played-notes", (obj) => {
    io.emit("receive-played-notes", obj);
  });
  socket.on("send-lifted-notes", (obj) => {
    io.emit("receive-lifted-notes", obj);
  });
  socket.on("request-sustain-toggle", () => {
    io.emit("ask-sustain-toggle");
  });
  socket.on("send-sustain-toggle", (obj) => {
    io.emit("receive-sustain-toggle", obj);
  });
});
