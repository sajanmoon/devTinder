const express = require("express");

const app = express();
app.use("admin", (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("unauthorized code");
  } else {
    next();
  }
});
app.get(
  "/admin/profile",
  (req, res) => {
    res.send("Route Handler");
  },
  (req, res) => {
    res.send("Route Handler 2");
  }
);

app.listen(3000, () => {
  console.log("Server is istening succesfully on 3000 port");
});
