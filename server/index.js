const io = require("socket.io")(4444, { cors: { origin: "*" } });

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    io.emit("user-connected", name);
    io.emit("initial-user-list", Object.values(users));
  });

  socket.on("send-chat-message", (message) => {
    io.emit("chat-message", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
    io.emit("initial-user-list", Object.values(users));
  });
});
