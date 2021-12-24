//import auth from "./middleware/auth.js";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import user from "./routes/user.js";
import userDetails from "./routes/userDetails/userDetails.js";
import list from "./routes/friendsList/friendsList.js";
import { io } from "socket.io-client";

import groups from "./routes/groups/groups.js";
import Conversation from "./models/conversation.js";
import Rep from "./models/reply.js";
import AddFriend from "./models/addfriend.js";
import multer from "multer";

import path from "path";

import { fork } from "child_process";
import { chatList } from "./controllers/chatList/chatList.js";
import { pipeline } from "stream";
import { promisify } from "util";
import fs from "fs";
const pipelineAsync = promisify(pipeline);
const __dirname = path.resolve();

// const redisClient = redis.createClient(6379);
const forked = fork("./messageQueue/messageQueue.js");

forked.on("message", (msg) => {
  ios.emit("socket", msg);
});

const port = process.env.PORT || 3001;

const ios = io("ws://localhost:3002");
ios.on("backend", (data) => {
  console.log(data, "From Socket");
});

{
  /*Express server connection*/
}
console.log(__dirname);
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "50mb" })); //For JSON requests
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
// app.use(upload.array());
app.use(cors({ origin: "http://localhost:3000" }));

{
  /*Express server connection end*/
}

var queue = [];

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
    app.listen(port, () => console.log(`Listening on Port:${port}`));
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (req, res) => {
  res.status(200).send("Hello");
});

app.post("/signUp", user);

app.post("/login", user);

app.get("/userDetails", userDetails);

app.get("/friendsList", list);

// get Messages
app.get("/chatList/:id", chatList);

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

app.get("/groups", groups);
app.put("/addtoroom", (req, res) => {
  const data = req.body;
  // console.log(data);

  try {
    Groups.findByIdAndUpdate(
      { _id: data.receiver },
      { $push: { room: data.sender } },
      (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          // console.log("done");
          res.status(201).send(data);
        }
      }
    );
  } catch (error) {
    console.log(error.message);
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

app.post("/group", (req, res) => {
  const data = req.body;
  let e = [];
  let d = {
    ownerId: data.ownerId,
    roomName: data.roomName,
    room: e,
    ownerName: data.onwerName,
  };

  try {
    Groups.create(d, (err, data) => {
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

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const user = await Conversation.deleteOne({ _id: id }).lean();
  } catch (error) {
    console.log(error);
  }
});

// setInterval(async () => {
//   if (queue.length) {
//     let data = queue[0];

//     console.log(Date.now() - data.time);
//   }
//   for (let queueLength = 0; queueLength < queue.length; queueLength++) {
//     let data = queue[queueLength];
//     if (Date.now() - data.time > 5 * 1000) {
//       console.log("jreee");
//       let result = await MessageQueue(queue[queueLength]);
//       queue.splice(queueLength, 1);
//     }
//   }
// }, 1000 * 2);
const upload = multer();
app.post("/upload", upload.single("file"), async (req, res, next) => {
  const { file, body } = req;
  // console.log(req.file);
  let messageData = JSON.parse(body.messageData);

  let fileName = `image${Math.floor(Math.random() * 1000)}_${
    messageData.roomId
  }.${file.detectedMimeType.split("image/")[1]}`;
  console.log(fileName);

  await pipelineAsync(
    file.stream,
    fs.createWriteStream(`./public/images/${fileName}`)
  )
    .then(() => {
      messageData.message.message = `/images/${fileName}`;
      Conversation.create(messageData, (err, messageData) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          console.log("donne");
          res.status(201).send({ path: `/images/${fileName}` });
        }
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
});
