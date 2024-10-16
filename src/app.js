const express = require("express");

const app = express();
app.use("/", (req, res) => {
  res.send("Hello world");
});

app.use("/test", (req, res) => {
  res.send("server is running");
});

app.use("/hello", (req, res) => {
  res.send("hello is running");
});

app.listen(3000, () => {
  console.log("Server is istening succesfully on 3000 port");
});

