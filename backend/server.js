const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");

const { Server } = require("socket.io");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});

const authRoutes = require("./routes/authRoutes");
const folderRoutes = require("./routes/folderRoutes");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/folder", folderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);


app.get("/", (req, res) => {
  res.send("Сървърът работи!");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Слушаме за прекъсване на връзката
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB is online"))
  .catch((err) => console.error("some error:++", err));

server.listen(PORT, () =>
  console.log(`Hi i'm listening on http://localhost:${PORT} `)
);
