require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./models/corsOptions");
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cors(corsOptions));
const DbConnect = require("./config/dbConnect");

DbConnect();
//users
app.use("/api", require("./routes/userRouter"));
//articles
app.use("/api/articles", require("./routes/articleRouter"));
app.use("/api/articles/comments", require("./routes/commentRouter"));

mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log(`app is listening on ${PORT}`);
  });
});
mongoose.connection.on("error", (err) => {
  console.log("Error while connecting to MongoDB: ", err);
});
