const express = require("express");
const app = express();
const mongoose = require("mongoose");
const postRouter = require("./routes/postRoutes");
const authRouter = require("./routes/authRoutes");
const cors = require("cors")
var session = require("express-session");
let RedisStore = require("connect-redis").default;
let { createClient } = require("redis");

const port = process.env.port || 3000;
const {
  MONGO_IP,
  MONGO_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}`;
let redisClient = createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`,
});
redisClient
  .connect()
  .then(() => {
    console.log("redis got connected");
  })
  .catch(console.error);

let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

app.enable("trust proxy")

app.use(cors())

app.use(
  session({
    store: redisStore,
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      maxAge: 30000000,
    },
  })
);

app.use(express.json());
app.use(session({ secret: "keyboard cat", cookie: { maxAge: 60000 } }));
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/auth", authRouter);

app.get("/api", (req, res) => {
  res.send("Hello wasdforld");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const connectWithRetry = async () => {
  await mongoose
    .connect(mongoURL)
    .then(() => {
      console.log("yeah it got connected successfully");
    })
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
