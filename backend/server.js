const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const folderRoutes = require("./routes/folderRoutes");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/folder", folderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB is online"))
  .catch((err) => console.error("some error:++", err));

app.listen(PORT, () =>
  console.log(`Hi i'm listening on http://localhost:${PORT} `)
);
