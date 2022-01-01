//import auth from "./middleware/auth.js";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import user from "./routes/user.js";
import userDetails from "./routes/userDetails/userDetails.js";
import list from "./routes/friendsList/friendsList.js";
// import { io } from "socket.io-client";
import groups from "./routes/groups/groups.js";
import Conversation from "./models/conversation.js";
import Rep from "./models/reply.js";
import AddFriend from "./models/addfriend.js";
// import multer from "multer";
import path from "path";
import { fork } from "child_process";
import { chatList } from "./controllers/chatList/chatList.js";
import { pipeline } from "stream";
import { promisify } from "util";
/*Creating Socket Server */
import { createServer } from "http";
import { Server } from "socket.io";
const port = process.env.PORT || 3001;
const __dirname = path.resolve();
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "50mb" })); //For JSON requests
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.use(cors({ origin: "http://localhost:3000" }));

const http = createServer(app);

const io = new Server(http, {
  cors: { origin: "http://localhost:3000" },
});

let id = [];
const rooms = {};

const addUser = (userId, socketId) => {
  !id.some((id) => id.userId === userId) && id.push({ userId, socketId });
  console.log(`Number of users online ${id.length}`);
};

const removeUser = (socketId) => {
  id = id.filter((id) => id.socketId !== socketId);
};

const getUser = (receiverId) => {
  return id.find((id) => id.userId === receiverId);
};
const forked = fork("./messageQueue/messageQueue.js");

io.on("connection", (socket) => {
  console.log("New websocket connection", socket.id);
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);

    io.emit("getUsers", id);
  });

  socket.on("socket", (data) => {
    const user = getUser(data.receiverId);
    console.log(data);
    io.to(user?.socketId).emit("getMessage", {
      time: data.time,
      senderId: data.senderId,
      receiverId: data.receiverId,
      messageId: data.time,
      message: data.message.message,
      referenceId: data.messageId,
      replied: data.replied,
      read: data.message.read,
      attachments: data.message.attachments,
      roomId: data.roomId,
    });
  });

  forked.on("message", (data) => {
    const user = getUser(data.receiverId);
    console.log(user);
    io.to(user?.socketId).emit("getMessage", {
      time: data.time,
      senderId: data.senderId,
      receiverId: data.receiverId,
      messageId: data.time,
      message: data.message.message,
      referenceId: data.messageId,
      replied: data.replied,
      read: data.message.read,
      attachments: data.message.attachments,
      roomId: data.roomId,
    });
    // console.log(msg);
  });
  socket.on("user_join", (data) => {
    console.log(data);
    socket.join(data.groupName);
  });

  socket.on("gmessage", (data) => {
    console.log(data);
    io.to(data.roomName).emit("takeMessage", data.message);
  });

  socket.on("room-created", (data) => {
    rooms[data] = { users: [] };
    io.emit("room", data);

    rooms[data].users[socket.id] = data;
    console.log(rooms);
  });

  socket.on(
    "sendmessage",
    ({
      time,
      senderId,
      receiverId,

      messageId,
      message,
      referenceId,

      replied,
      read,
      attachments,

      roomId,
    }) => {
      const user = getUser(receiverId);

      io.to(user.socketId).emit("getMessage", {
        time,
        senderId,
        receiverId,
        messageId,
        message,
        referenceId,
        replied,
        read,
        attachments,
        roomId,
      });
    }
  );
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    console.log(`Number of users online ${id.length}`);

    io.emit("getUsers", id);
  });
});

// ---------------------------------------------------------------------------------

const pipelineAsync = promisify(pipeline);

console.log(__dirname);

var queue = [];

app.get("/", (req, res) => {
  res.status(200).send("Hello");
});

app.post("/signUp", user);

app.post("/login", user);

app.get("/userDetails", userDetails);
app.get("/friendsList", list);

app.get("/chatList/:id", chatList);

// get Messages

app.get("/replyList/:conversationId", async (req, res) => {
  const conversationId = req.params.conversationId;

  try {
    const data = await Rep.find({ conversationId });
    // console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/create", async (req, res) => {
  const data = req.body;
  if (data.scheduleTime) {
    queue.push(data);
    forked.send(data);
    res.status(201).send(data);
  } else {
    const conversation = new Conversation(data);
    try {
      await conversation.save();
      res.status(201).send(data);
    } catch (error) {
      res.status(500).send(err);
    }
  }
});

app.post("/reply", (req, res) => {
  const data = req.body;

  try {
    Rep.create(data, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    });
  } catch (error) {
    console.log(error.message, "chat creation failed.");
  }
});

app.post("/addfriend", async (req, res) => {
  let data = {
    s1: req.body.userId,
    s2: req.body.friendId,
  };
  try {
    AddFriend.create(data, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    });
  } catch (error) {
    console.log(error.message, "chat creation failed.");
  }
});

//DB configuration
const config_url =
  "mongodb+srv://aakash:ATgYUPlifmn7p4qx@cluster0.gzv6s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

var client = mongoose
  .connect(config_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    http.listen(port, () => console.log(`Listening on Port:${port}`));
  })
  .catch((e) => {
    console.log(e);
  });
