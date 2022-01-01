import { Server } from "socket.io";

let initializeSockets = (http) => {
  let io = new Server(http, {
    maxHttpBufferSize: 10e8,
    cors: {
      origin: "3000",
    },
  });

  io.on("connection", (socket) => {
    console.log(socket);
  });
  io.on("error", (err) => {
    console.log(err);
  });
};

export default initializeSockets;
