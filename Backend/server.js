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

io.on("connection", (socket) => {
  console.log("New websocket connection", socket.id);
  socket.on("checkcheck", (data) => {
    console.log(data);
  });
});

// ---------------------------------------------------------------------------------

const pipelineAsync = promisify(pipeline);

const forked = fork("./messageQueue/messageQueue.js");

console.log(__dirname);

var queue = [];

app.get("/", (req, res) => {
  res.status(200).send("Hello");
});

app.post("/signUp", user);

app.post("/login", user);

app.get("/userDetails", userDetails);

// get Messages

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
