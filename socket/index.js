const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const { connectDB } = require("./db");
const { verifyJWT } = require("./verify");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, 
});

async function bootstrap() {
  await connectDB();

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const user = verifyJWT(token);
      socket.user = user;
      return next();
    } catch (err) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const { userId, role } = socket.user;
    console.log(socket.user)
    socket.join(userId);


    socket.on("order:update", ({ orderId, status }) => {
      console.log(`Got update for ${orderId}: ${status}`);
      io.emit("order:status", { orderId, status });
    });

    socket.on("disconnect", () => {
    });
  });

  app.use(express.json());

  const PORT = process.env.SOCKET_PORT || 4000;
  server.listen(PORT, () => {
    console.log(`Socket server running on http://localhost:${PORT}`);
  });
}

bootstrap().catch(console.error);
